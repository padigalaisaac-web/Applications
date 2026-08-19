import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';

import bookRoutes from './routes/bookRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

/*
 * Railway provides PORT automatically.
 * 5000 is only used when running locally.
 */
const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI environment variable is missing');
  process.exit(1);
}

/*
 * CORS
 *
 * For production:
 * CLIENT_ORIGIN=https://your-frontend-domain.com
 *
 * For multiple frontend URLs:
 * CLIENT_ORIGIN=https://site1.com,https://site2.com
 */
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : true;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());

/*
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Library Management API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

/*
 * API routes
 */
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/transactions', transactionRoutes);

/*
 * 404 handler
 */
app.use(notFound);

/*
 * Global error handler
 */
app.use(errorHandler);

/*
 * Start server only after MongoDB connection succeeds.
 */
async function startServer() {
  try {
    await connectDB(MONGODB_URI);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();

export default app;
