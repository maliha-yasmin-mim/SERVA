import express from 'express';
import {
  getAdminOverview,
  getUsersList,
  getPendingVerifications,
  getVerificationDocument,
  reviewUserVerification,
  getReports,
  resolveReport,
  getAuditLogs
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/overview', getAdminOverview);
router.get('/users', getUsersList);
router.get('/verifications', getPendingVerifications);
router.get('/verifications/:userId/document', getVerificationDocument);
router.patch('/verifications/:userId', reviewUserVerification);
router.get('/reports', getReports);
router.patch('/reports/:id', resolveReport);
router.get('/audit-logs', getAuditLogs);

export default router;
