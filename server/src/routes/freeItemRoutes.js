import express from 'express';
import {
  getFreeItems,
  getFreeItemById,
  createFreeItem,
  requestFreeItem,
  updateFreeItemStatus,
  getMyFreeItems
} from '../controllers/freeItemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getFreeItems)
  .post(protect, createFreeItem);

router.get('/my', protect, getMyFreeItems);
router.get('/:id', getFreeItemById);
router.post('/:id/request', protect, requestFreeItem);
router.patch('/:id/status', protect, updateFreeItemStatus);

export default router;
