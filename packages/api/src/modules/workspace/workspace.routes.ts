import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { workspaceController } from './workspace.controller';
import { createWorkspaceSchema } from './workspace.validation';

const router = Router();

router.post(
  '/',
  authMiddleware,
  validate(createWorkspaceSchema, 'body'),
  (req, res, next) => {
    workspaceController.create(req, res).catch(next);
  }
);

export default router;