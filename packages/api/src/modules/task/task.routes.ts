
import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { taskRateLimiter } from '@middlewares/rateLimit.middleware';
import { taskController } from './task.controller';
import {
  createTaskSchema,
  updateTaskSchema,
} from './task.validation';

const router = Router();

router.get(
  '/:workspaceId',
  taskRateLimiter,
  authMiddleware,
  (req, res, next) => {
    taskController.getMine(req, res).catch(next);
  }
);

router.get(
  '/:workspaceId/:id',
  taskRateLimiter,
  authMiddleware,
  (req, res, next) => {
    taskController.getById(req, res).catch(next);
  }
);

router.post(
  '/:workspaceId',
  taskRateLimiter,
  authMiddleware,
  validate(createTaskSchema, 'body'),
  (req, res, next) => {
    taskController.create(req, res).catch(next);
  }
);

router.patch(
  '/:workspaceId/:id',
  taskRateLimiter,
  authMiddleware,
  validate(updateTaskSchema, 'body'),
  (req, res, next) => {
    taskController.update(req, res).catch(next);
  }
);

router.delete(
  '/:workspaceId/:id',
  taskRateLimiter,
  authMiddleware,
  (req, res, next) => {
    taskController.delete(req, res).catch(next);
  }
);

export default router;
