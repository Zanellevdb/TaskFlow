import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from './auth.validation';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  validate(registerSchema, 'body'),
  (req, res, next) => {
    authController.register(req, res).catch(next);
  }
);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validate(loginSchema, 'body'), (req, res, next) => {
  authController.login(req, res).catch(next);
});

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post(
  '/refresh',
  validate(refreshTokenSchema, 'body'),
  (req, res, next) => {
    authController.refresh(req, res).catch(next);
  }
);

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', authMiddleware, (req, res, next) => {
  authController.getCurrentUser(req, res).catch(next);
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authMiddleware, (req, res, next) => {
  authController.logout(req, res).catch(next);
});

export default router;