import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import ProofRecord from '../models/ProofRecord.js';
import AuditLog from '../models/AuditLog.js';
import { calculateCandidateMatchScore } from '../utils/matchingAlgorithm.js';
import { STATUS } from '../config/constants.js';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { introduction, skills, experience, availability, proposedPayment } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.poster.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot apply to your own job post' });
    }

    if (job.status !== STATUS.JOB.OPEN) {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting new applications' });
    }

    // Check duplicate
    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already submitted an application for this job' });
    }

    let cvPath = '';
    if (req.file) {
      cvPath = `/uploads/${req.file.filename}`;
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      introduction,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : req.user.skills || []),
      experience: experience || '',
      availability: availability || 'Available immediately',
      proposedPayment: proposedPayment ? Number(proposedPayment) : job.budget,
      cvPath
    });

    // Increment application count
    job.applicationsCount = (job.applicationsCount || 0) + 1;
    await job.save();

    // Create Notification for Job Poster
    await Notification.create({
      recipient: job.poster,
      sender: req.user._id,
      type: 'application',
      title: 'New Job Application Received',
      message: `${req.user.name} applied for "${job.title}" with proposed budget BDT ${application.proposedPayment}`,
      link: `/dashboard/received-applications?jobId=${job._id}`
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'JOB_APPLICATION_SUBMITTED',
      entityType: 'Application',
      entityId: application._id.toString(),
      details: { jobId, proposedPayment: application.proposedPayment }
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a specific job (poster only)
// @route   GET /api/applications/job/:jobId
export const getApplicationsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.poster.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone avatar location rating reviewCount completedJobsCount verificationStatus isAvailableNow skills availabilitySchedule')
      .sort({ createdAt: -1 });

    // Compute smart matching scores for each applicant
    const applicationsWithScore = applications.map(app => {
      const matchResult = app.applicant ? calculateCandidateMatchScore(job, app.applicant) : null;
      return {
        ...app.toObject(),
        matchScore: matchResult?.score || 70,
        matchBreakdown: matchResult?.breakdown,
        matchFactors: matchResult?.matchFactors || []
      };
    });

    // Sort by match score descending
    applicationsWithScore.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    res.json({ success: true, count: applicationsWithScore.length, applications: applicationsWithScore });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's submitted applications
// @route   GET /api/applications/my
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'poster', select: 'name avatar location rating verificationStatus' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Accept / Reject)
// @route   PATCH /api/applications/:id/status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Accepted' | 'Rejected' | 'Under Review'
    const application = await Application.findById(req.params.id).populate('applicant', 'name email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const job = await Job.findById(application.job);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Associated job not found' });
    }

    if (job.poster.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    if (status === STATUS.APPLICATION.ACCEPTED) {
      // Assign job to applicant
      job.status = STATUS.JOB.ASSIGNED;
      job.assignedTo = application.applicant._id;
      await job.save();

      // Initialize ProofRecord automatically for this job if not already existing
      let proof = await ProofRecord.findOne({ job: job._id });
      if (!proof) {
        // Build initial standard checklist based on requirements or defaults
        const initialChecklist = (job.requirements && job.requirements.length > 0)
          ? job.requirements.map(reqText => ({ title: reqText, isRequired: true }))
          : [
              { title: 'Initial on-site assessment and client alignment', isRequired: true },
              { title: 'Pre-work photographic evidence capture', isRequired: true },
              { title: 'Core service execution according to specifications', isRequired: true },
              { title: 'Site cleanup and final inspection', isRequired: true },
              { title: 'Post-work photographic evidence & client signoff', isRequired: true }
            ];

        proof = await ProofRecord.create({
          job: job._id,
          provider: application.applicant._id,
          client: job.poster,
          status: STATUS.PROOFBOX.IN_PROGRESS,
          checklist: initialChecklist,
          completionReportId: `SRV-PB-${Date.now().toString().slice(-6)}`
        });
      }

      // Notify Applicant
      await Notification.create({
        recipient: application.applicant._id,
        sender: req.user._id,
        type: 'job_status',
        title: 'Application Accepted! 🎉',
        message: `Congratulations! Your application for "${job.title}" was accepted. The job is now assigned to you with SERVA ProofBox active.`,
        link: `/dashboard/proofbox/${job._id}`
      });
    } else if (status === STATUS.APPLICATION.REJECTED) {
      await Notification.create({
        recipient: application.applicant._id,
        sender: req.user._id,
        type: 'job_status',
        title: 'Application Status Update',
        message: `Your application for "${job.title}" was reviewed. The poster decided to proceed with other candidates.`,
        link: `/dashboard/my-applications`
      });
    }

    res.json({ success: true, application, jobStatus: job.status });
  } catch (error) {
    next(error);
  }
};
