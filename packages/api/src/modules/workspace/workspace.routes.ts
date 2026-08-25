import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { workspaceController } from './workspace.controller';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from './workspace.validation';

const router = Router();

router.get(
  '/',
  authMiddleware,
  (req, res, next) => {
    workspaceController.getMine(req, res).catch(next);
  }
);

router.get(
  '/:id',
  authMiddleware,
  (req, res, next) => {
    workspaceController.getById(req, res).catch(next);
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

router.patch(
  '/:id',
  authMiddleware,
  validate(updateWorkspaceSchema, 'body'),
  (req, res, next) => {
    workspaceController.update(req, res).catch(next);
  }
);

router.delete(
  '/:id',
  authMiddleware,
  (req, res, next) => {
    workspaceController.delete(req, res).catch(next);
  }
);

export default router;