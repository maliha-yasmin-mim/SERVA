import express from 'express';
import {
  applyForJob,
  getApplicationsForJob,
  getMyApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/:jobId', protect, upload.single('cv'), applyForJob);
router.get('/job/:jobId', protect, getApplicationsForJob);
router.get('/my', protect, getMyApplications);
router.patch('/:id/status', protect, updateApplicationStatus);

export default router;
