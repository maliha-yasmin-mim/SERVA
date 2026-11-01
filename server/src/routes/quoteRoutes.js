import express from 'express';
import {
  requestQuote,
  getMySentQuotes,
  getIncomingQuotes,
  respondQuote
} from '../controllers/quoteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, requestQuote);
router.get('/my-requests', protect, getMySentQuotes);
router.get('/incoming', protect, getIncomingQuotes);
router.patch('/:id/respond', protect, respondQuote);

export default router;
