import './src/config/env.js';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

let dbConnected = false;

// Vercel serverless handler — wraps the Express app
export default async function handler(req, res) {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (err) {
      console.warn('[Vercel] DB connection warning:', err.message);
    }
  }
  return app(req, res);
}
