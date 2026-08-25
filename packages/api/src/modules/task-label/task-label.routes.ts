import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { taskLabelController } from './task-label.controller';
import { createTaskLabelSchema } from './task-label.validation';

const router = Router();

router.get(
  '/:workspaceId/:taskId',
  authMiddleware,
  (req, res, next) => {
    taskLabelController.getMine(req, res).catch(next);
  }
);

router.post(
  '/:workspaceId/:taskId',
  authMiddleware,
  validate(createTaskLabelSchema, 'body'),
  (req, res, next) => {
    taskLabelController.create(req, res).catch(next);
  }
);

router.delete(
  '/:workspaceId/:taskId/:id',
  authMiddleware,
  (req, res, next) => {
    taskLabelController.delete(req, res).catch(next);
  }
);

export default router;