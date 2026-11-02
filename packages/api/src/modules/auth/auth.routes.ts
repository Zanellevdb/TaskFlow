
import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import {
  loginRateLimiter,
  registerRateLimiter,
  refreshRateLimiter,
} from '@middlewares/rateLimit.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from './auth.validation';

const router = Router();

router.post(
  '/register',
  registerRateLimiter,
  validate(registerSchema, 'body'),
  (req, res, next) => {
    authController.register(req, res).catch(next);
  }
);

router.post(
  '/login',
  loginRateLimiter,
  validate(loginSchema, 'body'),
  (req, res, next) => {
    authController.login(req, res).catch(next);
  }
);

router.post(
  '/refresh',
  refreshRateLimiter,
  validate(refreshTokenSchema, 'body'),
  (req, res, next) => {
    authController.refresh(req, res).catch(next);
  }
);

router.get('/me', authMiddleware, (req, res, next) => {
  authController.getCurrentUser(req, res).catch(next);
});

router.post('/logout', authMiddleware, (req, res, next) => {
  authController.logout(req, res).catch(next);
});

export default router;
