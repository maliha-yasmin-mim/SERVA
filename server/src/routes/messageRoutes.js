import express from 'express';
import { getConversations, getMessages, sendMessage, updateTypingStatus } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:conversationId', protect, getMessages);
router.post('/:conversationId/typing', protect, updateTypingStatus);
router.post('/', protect, sendMessage);

export default router;
