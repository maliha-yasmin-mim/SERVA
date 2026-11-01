import express from 'express';
import {
  getProofRecordByJob,
  updateChecklistItem,
  addChecklistItem,
  uploadProofMedia,
  addProgressUpdate,
  submitForApproval,
  clientApprovalAction,
  downloadCompletionReportPDF
} from '../controllers/proofboxController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/job/:jobId', protect, getProofRecordByJob);
router.patch('/:id/checklist', protect, updateChecklistItem);
router.post('/:id/checklist', protect, addChecklistItem);
router.post('/:id/media', protect, upload.single('image'), uploadProofMedia);
router.post('/:id/progress', protect, addProgressUpdate);
router.post('/:id/submit', protect, submitForApproval);
router.post('/:id/approval', protect, clientApprovalAction);
router.get('/:id/report.pdf', downloadCompletionReportPDF);

export default router;
