import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
  getMyPostedJobs,
  getMyAssignedJobs,
  toggleSaveJob
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, createJob);

router.get('/my/posted', protect, getMyPostedJobs);
router.get('/my/assigned', protect, getMyAssignedJobs);

router.route('/:id')
  .get(getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

router.patch('/:id/status', protect, updateJobStatus);
router.post('/:id/save', protect, toggleSaveJob);

export default router;
