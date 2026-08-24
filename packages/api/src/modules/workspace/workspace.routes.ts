import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { workspaceController } from './workspace.controller';
import { createWorkspaceSchema } from './workspace.validation';

const router = Router();

router.get(
  '/',
  authMiddleware,
  (req, res, next) => {
    workspaceController.getMine(req, res).catch(next);
  }
);

router.post(
  '/',
  authMiddleware,
  validate(createWorkspaceSchema, 'body'),
  (req, res, next) => {
    workspaceController.create(req, res).catch(next);
  }
);

export default router;