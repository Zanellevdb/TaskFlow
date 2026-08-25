import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { projectController } from './project.controller';
import {
  createProjectSchema,
  updateProjectSchema,
} from './project.validation';

const router = Router();

router.get(
  '/:workspaceId',
  authMiddleware,
  (req, res, next) => {
    projectController.getMine(req, res).catch(next);
  }
);

router.get(
  '/:workspaceId/:id',
  authMiddleware,
  (req, res, next) => {
    projectController.getById(req, res).catch(next);
  }
);

router.post(
  '/:workspaceId',
  authMiddleware,
  validate(createProjectSchema, 'body'),
  (req, res, next) => {
    projectController.create(req, res).catch(next);
  }
);

router.patch(
  '/:workspaceId/:id',
  authMiddleware,
  validate(updateProjectSchema, 'body'),
  (req, res, next) => {
    projectController.update(req, res).catch(next);
  }
);

router.delete(
  '/:workspaceId/:id',
  authMiddleware,
  (req, res, next) => {
    projectController.delete(req, res).catch(next);
  }
);

export default router;