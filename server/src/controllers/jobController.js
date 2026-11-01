import Job from '../models/Job.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { STATUS } from '../config/constants.js';

// @desc    Get all jobs with search and filters
// @route   GET /api/jobs
export const getJobs = async (req, res, next) => {
  try {
    const { keyword, category, location, minBudget, maxBudget, urgency, status, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { requiredSkills: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (urgency && urgency !== 'All') {
      query.urgency = urgency;
    }

    if (status) {
      query.status = status;
    } else {
      query.status = { $in: [STATUS.JOB.OPEN, STATUS.JOB.ASSIGNED, STATUS.JOB.IN_PROGRESS] };
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'budget_high') sortOption = { budget: -1 };
    if (sort === 'budget_low') sortOption = { budget: 1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate('poster', 'name avatar location rating reviewCount verificationStatus isAvailableNow')
      .populate('assignedTo', 'name avatar rating verificationStatus')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: jobs.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('poster', 'name email phone avatar location rating reviewCount verificationStatus reliabilityScore isAvailableNow')
      .populate('assignedTo', 'name email phone avatar rating verificationStatus');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job listing not found' });
    }

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a job post
// @route   POST /api/jobs
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      location,
      budget,
      paymentType,
      workDate,
      startTime,
      expectedDuration,
      workersNeeded,
      requiredSkills,
      requirements,
      urgency,
      contactPreference,
      images
    } = req.body;

    if (!title || !description || !category || !location || !budget) {
      return res.status(400).json({ success: false, message: 'Please provide all required job fields' });
    }

    const job = await Job.create({
      title,
      description,
      category,
      location,
      budget: Number(budget),
      paymentType: paymentType || 'Fixed',
      workDate: workDate || 'Flexible',
      startTime: startTime || 'Morning',
      expectedDuration: expectedDuration || '1-2 Days',
      workersNeeded: workersNeeded ? Number(workersNeeded) : 1,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : []),
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(s => s.trim()) : []),
      urgency: urgency || 'Normal',
      contactPreference: contactPreference || 'In-App Chat',
      images: images || [],
      poster: req.user._id,
      status: STATUS.JOB.OPEN
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'JOB_CREATED',
      entityType: 'Job',
      entityId: job._id.toString(),
      details: { title: job.title, budget: job.budget, category: job.category }
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job post
// @route   PUT /api/jobs/:id
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.poster.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job post' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, job: updatedJob });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job status (Open, Assigned, In Progress, Completed, Cancelled)
// @route   PATCH /api/jobs/:id/status
export const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const isPoster = job.poster.toString() === req.user._id.toString();
    const isAssigned = job.assignedTo && job.assignedTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPoster && !isAssigned && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized to change status of this job' });
    }

    job.status = status;
    await job.save();

    await AuditLog.create({
      user: req.user._id,
      action: 'JOB_STATUS_UPDATED',
      entityType: 'Job',
      entityId: job._id.toString(),
      details: { newStatus: status }
    });

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job post
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.poster.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.json({ success: true, message: 'Job removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's posted jobs
// @route   GET /api/jobs/my/posted
export const getMyPostedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ poster: req.user._id })
      .populate('assignedTo', 'name avatar rating verificationStatus')
      .sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's assigned/working jobs
// @route   GET /api/jobs/my/assigned
export const getMyAssignedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ assignedTo: req.user._id })
      .populate('poster', 'name avatar location rating verificationStatus')
      .sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle save/bookmark job
// @route   POST /api/jobs/:id/save
export const toggleSaveJob = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.id;

    const isSaved = user.savedJobs?.includes(jobId);
    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();
    res.json({ success: true, isSaved: !isSaved });
  } catch (error) {
    next(error);
  }
};
