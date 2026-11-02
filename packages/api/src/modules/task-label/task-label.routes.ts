
import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { taskLabelRateLimiter } from '@middlewares/rateLimit.middleware';
import { taskLabelController } from './task-label.controller';
import { createTaskLabelSchema } from './task-label.validation';

const router = Router();

router.get(
  '/:workspaceId/:taskId',
  taskLabelRateLimiter,
  authMiddleware,
  (req, res, next) => {
    taskLabelController.getMine(req, res).catch(next);
  }
);

router.post(
  '/:workspaceId/:taskId',
  taskLabelRateLimiter,
  authMiddleware,
  validate(createTaskLabelSchema, 'body'),
  (req, res, next) => {
    taskLabelController.create(req, res).catch(next);
  }
);

router.delete(
  '/:workspaceId/:taskId/:id',
  taskLabelRateLimiter,
  authMiddleware,
  (req, res, next) => {
    taskLabelController.delete(req, res).catch(next);
  }
);

export default router;
