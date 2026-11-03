import express from 'express';
import { register, login, logout, getMe, updateProfile, updateAvailability, submitVerification, getUserPublicProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { verificationUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.get('/users/:id', getUserPublicProfile);
router.put('/profile', protect, updateProfile);
router.put('/availability', protect, updateAvailability);
router.post('/verify-submit', protect, verificationUpload.single('document'), submitVerification);

export default router;
