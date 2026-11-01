import express from 'express';
import {
  initiatePayment,
  getMyPayments,
  getPaymentById,
  releaseEscrow
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/initiate', initiatePayment);
router.get('/my-payments', getMyPayments);
router.get('/:id', getPaymentById);
router.post('/:id/release-escrow', releaseEscrow);

export default router;

