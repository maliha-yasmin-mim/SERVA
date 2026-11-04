import './config/env.js';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDevelopmentDataIfEmpty } from './seed/seedData.js';

const PORT = process.env.PORT || 5000;

export const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('serva_jwt_secure_secret')) {
      if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
        throw new Error('JWT_SECRET must be a unique value of at least 32 characters. Set it in server/.env.');
      } else {
        process.env.JWT_SECRET = '11fd2f901c569c4a59f75eeb5ca5cd08549cb969b3e650878ec241e2b645ce6b';
        console.warn('⚠️ [Development Notice] Using auto-generated 64-char JWT_SECRET for local development.');
      }
    }

    await connectDB();

    // Auto seed if empty in non-serverless environments
    if (!process.env.VERCEL) {
      await seedDevelopmentDataIfEmpty();
    }

    // Only bind to local port when not running as a Vercel serverless function
    if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`🚀 SERVA Backend Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`📡 API Base: http://localhost:${PORT}/api`);
        console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
        console.log(`=======================================================`);
      });
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

// Start listening if executed directly (e.g. node src/server.js or local dev)
if (!process.env.VERCEL) {
  startServer();
} else {
  // Ensure DB connection is initiated on Vercel cold starts
  connectDB().catch((err) => console.warn('[Vercel DB Init Warning]', err.message));
}

export default app;
