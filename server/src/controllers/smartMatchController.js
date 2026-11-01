import Job from '../models/Job.js';
import User from '../models/User.js';
import { calculateCandidateMatchScore } from '../utils/matchingAlgorithm.js';

// @desc    Get smart-matched providers for a job post
// @route   GET /api/smart-match/job/:jobId/candidates
export const getMatchedCandidatesForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Find active providers in Bangladesh
    const candidates = await User.find({
      _id: { $ne: job.poster },
      role: 'user'
    }).select('name avatar bio location skills servicesOffered hourlyRate isAvailableNow availabilitySchedule rating reviewCount completedJobsCount verificationStatus');

    const scoredCandidates = candidates.map(candidate => {
      const match = calculateCandidateMatchScore(job, candidate);
      return {
        candidate,
        score: match.score,
        breakdown: match.breakdown,
        matchFactors: match.matchFactors,
        explanation: match.explanation
      };
    });

    // Sort by match score descending
    scoredCandidates.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      job: { _id: job._id, title: job.title, category: job.category, location: job.location },
      totalCandidates: scoredCandidates.length,
      recommendations: scoredCandidates.slice(0, 10)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended jobs for current logged in provider
// @route   GET /api/smart-match/my-recommendations
export const getRecommendedJobsForProvider = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const jobs = await Job.find({ status: 'Open', poster: { $ne: user._id } })
      .populate('poster', 'name avatar location rating verificationStatus')
      .limit(30);

    const scoredJobs = jobs.map(job => {
      const match = calculateCandidateMatchScore(job, user);
      return {
        job,
        score: match.score,
        breakdown: match.breakdown,
        matchFactors: match.matchFactors,
        explanation: match.explanation
      };
    });

    scoredJobs.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      recommendations: scoredJobs.slice(0, 8)
    });
  } catch (error) {
    next(error);
  }
};
