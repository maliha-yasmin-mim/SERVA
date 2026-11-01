import Review from '../models/Review.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Submit a review after completed job or interaction
// @route   POST /api/reviews
export const createReview = async (req, res, next) => {
  try {
    const { revieweeId, jobId, serviceId, rating, comment } = req.body;

    if (!revieweeId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide reviewee, rating and comment' });
    }

    if (revieweeId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot write a review for yourself' });
    }

    // Check if qualifying job was completed
    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      const isParticipant =
        job.poster.toString() === req.user._id.toString() ||
        (job.assignedTo && job.assignedTo.toString() === req.user._id.toString());

      if (!isParticipant) {
        return res.status(403).json({ success: false, message: 'Only job participants can review each other' });
      }
    }

    // Check duplicate
    const existing = await Review.findOne({ reviewer: req.user._id, job: jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already submitted a review for this job' });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      job: jobId || null,
      service: serviceId || null,
      rating: Number(rating),
      comment
    });

    // Recalculate reviewee average rating
    const userReviews = await Review.find({ reviewee: revieweeId });
    const avgRating = userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length;

    await User.findByIdAndUpdate(revieweeId, {
      rating: Number(avgRating.toFixed(1)),
      reviewCount: userReviews.length
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'REVIEW_SUBMITTED',
      entityType: 'Review',
      entityId: review._id.toString(),
      details: { revieweeId, rating }
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar location verificationStatus')
      .populate('job', 'title category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};
