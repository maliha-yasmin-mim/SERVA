import '../src/config/env.js';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[Vercel Serverless] Database connection warning:', err.message);
  }
  return app(req, res);
}