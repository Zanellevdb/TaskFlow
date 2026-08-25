import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { commentController } from './comment.controller';
import { createCommentSchema } from './comment.validation';

const router = Router();

router.get(
  '/:workspaceId/:taskId',
  authMiddleware,
  (req, res, next) => {
    commentController.getMine(req, res).catch(next);
  }
);

router.post(
  '/:workspaceId/:taskId',
  authMiddleware,
  validate(createCommentSchema, 'body'),
  (req, res, next) => {
    commentController.create(req, res).catch(next);
  }
);

router.delete(
  '/:workspaceId/:taskId/:id',
  authMiddleware,
  (req, res, next) => {
    commentController.delete(req, res).catch(next);
  }
);

export default router;