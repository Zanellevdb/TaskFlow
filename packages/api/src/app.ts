import express, { Application } from 'express';
import cors from 'cors';
import { errorMiddleware } from '@middlewares/error.middleware';
import authRoutes from '@modules/auth/auth.routes';
import workspaceRoutes from '@modules/workspace/workspace.routes';
import logger from '@config/logger';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? [] : '*',
    credentials: true,
  })
);

// Request logging
app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);

// Placeholder for other routes (will be added in later responses)
app.get('/api/docs', (_req, res) => {
  res.status(200).json({
    message: 'API Documentation will be available at /api/docs',
    version: '1.0.0',
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

export default app;