import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import productRoutes from './routes/productRoutes.js';
import freeItemRoutes from './routes/freeItemRoutes.js';
import proofboxRoutes from './routes/proofboxRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import smartMatchRoutes from './routes/smartMatchRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import favouriteRoutes from './routes/favouriteRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { uploadDirectory } from './config/storage.js';

const app = express();

// Parse allowed origins from environment
const rawOrigins = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = rawOrigins
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

// Dynamic CORS Origin Validator (Supports custom domains, Vercel preview/production URLs, & localhost)
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Server-to-server, Postman, mobile, or webhook requests
  if (process.env.ALLOW_ALL_CORS === 'true') return true;

  const normalized = origin.trim().replace(/\/$/, '');
  // Exact match from CLIENT_URL
  if (allowedOrigins.includes(normalized)) return true;

  // Allow all Vercel domains (*.vercel.app)
  if (/^https:\/\/.*\.vercel\.app$/.test(normalized)) return true;

  // Allow local development on any port
  if (/^http:\/\/localhost(:[0-9]+)?$/.test(normalized) || /^http:\/\/127\.0\.0\.1(:[0-9]+)?$/.test(normalized)) {
    return true;
  }

  return false;
};

// CORS Middleware Configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
      callback(new Error('CORS request blocked by security policy.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  const requestOrigin = req.get('origin');
  if (isMutation && requestOrigin && !isAllowedOrigin(requestOrigin)) {
    return res.status(403).json({ success: false, message: 'Request origin is not allowed.' });
  }
  next();
});

// Identity documents are kept outside the public media namespace.
app.use('/uploads', (req, res, next) => {
  const requestedPath = path.normalize(req.path);
  const fileName = path.basename(requestedPath);
  if (requestedPath.split(path.sep).includes('private-verification') || /^document-/i.test(fileName)) {
    return res.sendStatus(404);
  }
  next();
}, express.static(uploadDirectory));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'SERVA — Local Help. Trusted Connections.',
    time: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/products', productRoutes);
app.use('/api/free-items', freeItemRoutes);
app.use('/api/proofbox', proofboxRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/smart-match', smartMatchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
