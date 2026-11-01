import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { privateVerificationDirectory, uploadDirectory } from '../config/storage.js';

for (const directory of [uploadDirectory, privateVerificationDirectory]) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const privateVerificationStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, privateVerificationDirectory);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && (mime.startsWith('image/') || mime === 'application/pdf')) {
    return cb(null, true);
  }
  cb(new Error('Only JPEG, PNG, WEBP images and PDF documents are allowed'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

export const verificationUpload = multer({
  storage: privateVerificationStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});
