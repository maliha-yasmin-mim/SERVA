import './config/env.js';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDevelopmentDataIfEmpty } from './seed/seedData.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('serva_jwt_secure_secret')) {
      throw new Error('JWT_SECRET must be a unique value of at least 32 characters. Set it in server/.env.');
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
