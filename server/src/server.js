import './config/env.js';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDevelopmentDataIfEmpty } from './seed/seedData.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('serva_jwt_secure_secret')) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET must be a unique value of at least 32 characters. Set it in server/.env.');
      } else {
        process.env.JWT_SECRET = '11fd2f901c569c4a59f75eeb5ca5cd08549cb969b3e650878ec241e2b645ce6b';
        console.warn('⚠️ [Development Notice] Using auto-generated 64-char JWT_SECRET for local development.');
      }
    }

    await connectDB();

    // Auto seed if empty so immediate browsing works flawlessly
    await seedDevelopmentDataIfEmpty();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 SERVA Backend Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
      console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
