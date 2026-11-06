import './src/config/env.js';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

// Connect to database on serverless cold starts
connectDB().catch((err) => console.warn('[Vercel DB Init]', err.message));

export default app;
