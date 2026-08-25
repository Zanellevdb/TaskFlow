import express, { Application } from 'express';
import cors from 'cors';
import { errorMiddleware } from '@middlewares/error.middleware';
import authRoutes from '@modules/auth/auth.routes';
import workspaceRoutes from '@modules/workspace/workspace.routes';
import projectRoutes from '@modules/project/project.routes';
import taskRoutes from '@modules/task/task.routes';
import taskLabelRoutes from '@modules/task-label/task-label.routes';
import commentRoutes from '@modules/comment/comment.routes';
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
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/task-labels', taskLabelRoutes);
app.use('/api/comments', commentRoutes);

// API documentation placeholder
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