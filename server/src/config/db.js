import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export const connectDB = async () => {
  // Reuse existing connection if already connected (vital for serverless environments)
  if (mongoose.connection && mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[Database] Could not connect to configured MONGODB_URI: ${err.message}`);
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Production startup requires a reachable MongoDB connection.');
      }
      console.log('[Database] Falling back to automated in-memory MongoDB server for development...');
    }
  } else {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI must be configured in production.');
    }
    console.log('[Database] No MONGODB_URI set. Initializing high-speed in-memory MongoDB development instance...');
  }

  try {
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`[Database] Connected to In-Memory MongoDB: ${conn.connection.host} (${memUri})`);
  } catch (err) {
    console.error(`[Database] Error starting MongoMemoryServer: ${err.message}`);
    throw err;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
