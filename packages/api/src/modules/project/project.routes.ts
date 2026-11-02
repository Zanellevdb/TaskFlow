
import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { projectRateLimiter } from '@middlewares/rateLimit.middleware';
import { projectController } from './project.controller';
import {
  createProjectSchema,
  updateProjectSchema,
} from './project.validation';

const router = Router();

router.get(
  '/:workspaceId',
  projectRateLimiter,
  authMiddleware,
  (req, res, next) => {
    projectController.getMine(req, res).catch(next);
  }
);

router.get(
  '/:workspaceId/:id',
  projectRateLimiter,
  authMiddleware,
  (req, res, next) => {
    projectController.getById(req, res).catch(next);
  }
);

router.post(
  '/:workspaceId',
  projectRateLimiter,
  authMiddleware,
  validate(createProjectSchema, 'body'),
  (req, res, next) => {
    projectController.create(req, res).catch(next);
  }
);

router.patch(
  '/:workspaceId/:id',
  projectRateLimiter,
  authMiddleware,
  validate(updateProjectSchema, 'body'),
  (req, res, next) => {
    projectController.update(req, res).catch(next);
  }
);

router.delete(
  '/:workspaceId/:id',
  projectRateLimiter,
  authMiddleware,
  (req, res, next) => {
    projectController.delete(req, res).catch(next);
  }
);

export default router;
