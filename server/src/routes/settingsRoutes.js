import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getPublicSettings,
  getAdminSettings,
  uploadBrandingAsset,
  verifyAndSaveSettings
} from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadDirectory } from '../config/storage.js';

const router = express.Router();

// Custom branding asset storage (for logos and favicons)
const brandingStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const prefix = file.fieldname === 'favicon' ? 'favicon' : 'logo';
    cb(null, `${prefix}-${Date.now()}${ext}`);
  }
});

const brandingFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|svg|ico/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowed.test(ext) || file.mimetype.startsWith('image/')) {
    return cb(null, true);
  }
  cb(new Error('Only PNG, JPG, JPEG, WEBP, SVG and ICO files are allowed for branding assets.'));
};

const brandingUpload = multer({
  storage: brandingStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: brandingFilter
});

// Public endpoint
router.get('/public', getPublicSettings);

// Admin-only endpoints
router.get('/admin', protect, adminOnly, getAdminSettings);
router.post('/admin/upload', protect, adminOnly, brandingUpload.single('asset'), uploadBrandingAsset);
router.post('/admin/verify-and-save', protect, adminOnly, verifyAndSaveSettings);

export default router;

