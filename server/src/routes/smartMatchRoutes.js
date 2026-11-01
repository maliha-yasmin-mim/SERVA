import express from 'express';
import { getMatchedCandidatesForJob, getRecommendedJobsForProvider } from '../controllers/smartMatchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/job/:jobId/candidates', protect, getMatchedCandidatesForJob);
router.get('/my-recommendations', protect, getRecommendedJobsForProvider);

export default router;
