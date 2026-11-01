import ProofRecord from '../models/ProofRecord.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import { buildProofBoxPDF } from '../utils/pdfGenerator.js';
import { STATUS } from '../config/constants.js';

// @desc    Get or initialize proof record for a job
// @route   GET /api/proofbox/job/:jobId
export const getProofRecordByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId)
      .populate('poster', 'name email phone avatar location rating verificationStatus')
      .populate('assignedTo', 'name email phone avatar rating verificationStatus');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    let proof = await ProofRecord.findOne({ job: jobId })
      .populate('client', 'name email phone avatar')
      .populate('provider', 'name email phone avatar rating verificationStatus');

    if (!proof) {
      // Auto-create initial proof record if user is either client or provider
      const isClient = req.user && job.poster._id.toString() === req.user._id.toString();
      const isProvider = req.user && job.assignedTo && job.assignedTo._id.toString() === req.user._id.toString();

      if (!isClient && !isProvider && req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to access ProofBox for this job' });
      }

      const initialChecklist = (job.requirements && job.requirements.length > 0)
        ? job.requirements.map(reqText => ({ title: reqText, isRequired: true, isCompleted: false }))
        : [
            { title: 'Site Inspection & Safety Briefing', isRequired: true, isCompleted: false },
            { title: 'Before-Work Photo Capture', isRequired: true, isCompleted: false },
            { title: 'Core Task Execution', isRequired: true, isCompleted: false },
            { title: 'Clean-up & Equipment Check', isRequired: true, isCompleted: false },
            { title: 'After-Work Verification & Client Walkthrough', isRequired: true, isCompleted: false }
          ];

      proof = await ProofRecord.create({
        job: job._id,
        provider: job.assignedTo?._id || req.user._id,
        client: job.poster._id,
        status: STATUS.PROOFBOX.IN_PROGRESS,
        checklist: initialChecklist,
        completionReportId: `SRV-PB-${Date.now().toString().slice(-6)}`
      });

      proof = await ProofRecord.findById(proof._id)
        .populate('client', 'name email phone avatar')
        .populate('provider', 'name email phone avatar rating verificationStatus');
    }

    res.json({ success: true, proof, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or update a checklist item
// @route   PATCH /api/proofbox/:id/checklist
export const updateChecklistItem = async (req, res, next) => {
  try {
    const { itemId, isCompleted } = req.body;
    const proof = await ProofRecord.findById(req.params.id);

    if (!proof) {
      return res.status(404).json({ success: false, message: 'Proof record not found' });
    }

    const isProvider = proof.provider.toString() === req.user._id.toString();
    const isClient = proof.client.toString() === req.user._id.toString();

    if (!isProvider && !isClient && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this checklist' });
    }

    const item = proof.checklist.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Checklist item not found' });
    }

    item.isCompleted = isCompleted;
    if (isCompleted) {
      item.completedAt = new Date();
      item.completedBy = req.user._id;
    } else {
      item.completedAt = null;
      item.completedBy = null;
    }

    await proof.save();

    await AuditLog.create({
      user: req.user._id,
      action: 'CHECKLIST_ITEM_UPDATED',
      entityType: 'ProofRecord',
      entityId: proof._id.toString(),
      details: { itemTitle: item.title, isCompleted }
    });

    res.json({ success: true, checklist: proof.checklist });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new checklist item
// @route   POST /api/proofbox/:id/checklist
export const addChecklistItem = async (req, res, next) => {
  try {
    const { title, description, isRequired } = req.body;
    const proof = await ProofRecord.findById(req.params.id);

    if (!proof) {
      return res.status(404).json({ success: false, message: 'Proof record not found' });
    }

    proof.checklist.push({
      title,
      description: description || '',
      isRequired: isRequired !== undefined ? isRequired : true,
      isCompleted: false
    });

    await proof.save();
    res.json({ success: true, checklist: proof.checklist });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload Before or After Photo
// @route   POST /api/proofbox/:id/media
export const uploadProofMedia = async (req, res, next) => {
  try {
    const { type, note } = req.body; // type: 'before' | 'after'
    const proof = await ProofRecord.findById(req.params.id);

    if (!proof) {
      return res.status(404).json({ success: false, message: 'Proof record not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach an image file' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const mediaObj = {
      url: imageUrl,
      note: note || '',
      uploadedAt: new Date()
    };

    if (type === 'before') {
      proof.beforeImages.push(mediaObj);
    } else if (type === 'after') {
      proof.afterImages.push(mediaObj);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid media type. Must be "before" or "after".' });
    }

    await proof.save();

    await AuditLog.create({
      user: req.user._id,
      action: 'PROOF_MEDIA_UPLOADED',
      entityType: 'ProofRecord',
      entityId: proof._id.toString(),
      details: { type, imageUrl }
    });

    res.json({
      success: true,
      type,
      media: mediaObj,
      beforeImages: proof.beforeImages,
      afterImages: proof.afterImages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add text progress update
// @route   POST /api/proofbox/:id/progress
export const addProgressUpdate = async (req, res, next) => {
  try {
    const { text, imageUrl } = req.body;
    const proof = await ProofRecord.findById(req.params.id);

    if (!proof) {
      return res.status(404).json({ success: false, message: 'Proof record not found' });
    }

    proof.progressUpdates.push({
      text,
      imageUrl: imageUrl || '',
      timestamp: new Date()
    });

    await proof.save();
    res.json({ success: true, progressUpdates: proof.progressUpdates });
  } catch (error) {
    next(error);
  }
};

// @desc    Provider submits job proof for client review
// @route   POST /api/proofbox/:id/submit
export const submitForApproval = async (req, res, next) => {
  try {
    const proof = await ProofRecord.findById(req.params.id);
    if (!proof) {
      return res.status(404).json({ success: false, message: 'Proof record not found' });
    }

    if (proof.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the assigned provider can submit for approval' });
    }

    proof.status = STATUS.PROOFBOX.SUBMITTED_FOR_APPROVAL;
    proof.completedAt = new Date();
    await proof.save();

    const job = await Job.findById(proof.job);
    if (job) {
      job.status = STATUS.JOB.IN_PROGRESS;
      await job.save();
    }

    // Notify Client
    await Notification.create({
      recipient: proof.client,
      sender: req.user._id,
      type: 'proof_approval',
      title: 'Work Completed — Client Review Requested',
      message: `${req.user.name} has submitted the task checklist & photos for "${job?.title}". Please review and approve on SERVA ProofBox.`,
      link: `/dashboard/proofbox/${proof.job}`
    });

    res.json({ success: true, message: 'Proof submitted to client for approval', status: proof.status });
  } catch (error) {
    next(error);
  }
};

// @desc    Client approves work or requests corrections
// @route   POST /api/proofbox/:id/approval
export const clientApprovalAction = async (req, res, next) => {
  try {
    const { action, reason, feedback } = req.body; // action: 'Approved' | 'Corrections Requested'
    const proof = await ProofRecord.findById(req.params.id);

    if (!proof) {
      return res.status(404).json({ success: false, message: 'Proof record not found' });
    }

    if (proof.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the client can approve or request corrections' });
    }

    const job = await Job.findById(proof.job);

    if (action === 'Approved') {
      proof.status = STATUS.PROOFBOX.APPROVED;
      proof.clientFeedback = feedback || reason || 'Client reviewed and fully approved the completed work.';
      proof.approvalHistory.push({
        action: 'Approved',
        reason: proof.clientFeedback,
        timestamp: new Date()
      });

      if (job) {
        job.status = STATUS.JOB.COMPLETED;
        await job.save();
      }

      // Increment provider's completed jobs count
      await User.findByIdAndUpdate(proof.provider, {
        $inc: { completedJobsCount: 1 }
      });

      // Notify Provider
      await Notification.create({
        recipient: proof.provider,
        sender: req.user._id,
        type: 'proof_approval',
        title: 'Work Approved! 🎖️',
        message: `Your work on "${job?.title}" has been approved! The ProofBox completion certificate is now generated.`,
        link: `/dashboard/proofbox/${proof.job}`
      });
    } else if (action === 'Corrections Requested') {
      proof.status = STATUS.PROOFBOX.CORRECTIONS_REQUESTED;
      proof.approvalHistory.push({
        action: 'Corrections Requested',
        reason: reason || 'Please inspect items marked incomplete and upload updated after-photos.',
        timestamp: new Date()
      });

      // Notify Provider
      await Notification.create({
        recipient: proof.provider,
        sender: req.user._id,
        type: 'proof_approval',
        title: 'Correction Requested on Job Proof',
        message: `Client requested corrections: "${reason}". Please review checklist and update evidence.`,
        link: `/dashboard/proofbox/${proof.job}`
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Must be "Approved" or "Corrections Requested".' });
    }

    await proof.save();

    await AuditLog.create({
      user: req.user._id,
      action: action === 'Approved' ? 'PROOF_APPROVED' : 'PROOF_CORRECTION_REQUESTED',
      entityType: 'ProofRecord',
      entityId: proof._id.toString(),
      details: { action, reason }
    });

    res.json({ success: true, proof, jobStatus: job?.status });
  } catch (error) {
    next(error);
  }
};

// @desc    Download / Stream ProofBox Completion Report PDF
// @route   GET /api/proofbox/:id/report.pdf
export const downloadCompletionReportPDF = async (req, res, next) => {
  try {
    const proof = await ProofRecord.findById(req.params.id)
      .populate('client', 'name email phone avatar')
      .populate('provider', 'name email phone avatar rating verificationStatus');

    if (!proof) {
      return res.status(404).json({ success: false, message: 'Proof record not found' });
    }

    const job = await Job.findById(proof.job);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const filename = `SERVA-ProofBox-${proof.completionReportId || proof._id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    buildProofBoxPDF(proof, job, res);
  } catch (error) {
    next(error);
  }
};
