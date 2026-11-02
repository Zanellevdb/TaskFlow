
import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { workspaceRateLimiter } from '@middlewares/rateLimit.middleware';
import { workspaceController } from './workspace.controller';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from './workspace.validation';

const router = Router();

router.get(
  '/',
  workspaceRateLimiter,
  authMiddleware,
  (req, res, next) => {
    workspaceController.getMine(req, res).catch(next);
  }
);

router.get(
  '/:id/members',
  workspaceRateLimiter,
  authMiddleware,
  (req, res, next) => {
    workspaceController.getMembers(req, res).catch(next);
  }
);

router.get(
  '/:id',
  workspaceRateLimiter,
  authMiddleware,
  (req, res, next) => {
    workspaceController.getById(req, res).catch(next);
  }
);

router.post(
  '/',
  workspaceRateLimiter,
  authMiddleware,
  validate(createWorkspaceSchema, 'body'),
  (req, res, next) => {
    workspaceController.create(req, res).catch(next);
  }
);

router.patch(
  '/:id',
  workspaceRateLimiter,
  authMiddleware,
  validate(updateWorkspaceSchema, 'body'),
  (req, res, next) => {
    workspaceController.update(req, res).catch(next);
  }
);

router.delete(
  '/:id',
  workspaceRateLimiter,
  authMiddleware,
  (req, res, next) => {
    workspaceController.delete(req, res).catch(next);
  }
);

export default router;
