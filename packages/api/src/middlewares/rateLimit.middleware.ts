
import { rateLimit } from 'express-rate-limit';

interface RateLimitOptions {
  windowMs: number;
  limit: number;
  message: string;
  skipInTest?: boolean;
}

export const createRateLimiter = ({
  windowMs,
  limit,
  message,
  skipInTest = false,
}: RateLimitOptions) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: () => skipInTest && process.env.NODE_ENV === 'test',
    message: {
      success: false,
      message,
    },
  });

// General API protection
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Too many requests. Please try again later.',
  skipInTest: true,
});

// Authentication protection
export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many login attempts. Please try again in 15 minutes.',
  skipInTest: true,
});

export const registerRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: 'Too many registration attempts. Please try again in an hour.',
  skipInTest: true,
});

export const refreshRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: 'Too many token refresh requests. Please try again later.',
  skipInTest: true,
});
// Workspace API protection
export const workspaceRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: 'Too many workspace requests. Please try again later.',
  skipInTest: true,
});
// Task-label API protection
export const taskLabelRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: 'Too many task-label requests. Please try again later.',
  skipInTest: true,
});
// Task API protection
export const taskRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: 'Too many task requests. Please try again later.',
  skipInTest: true,
});
// Project API protection
export const projectRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: 'Too many project requests. Please try again later.',
  skipInTest: true,
});
// Comment API protection
export const commentRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: 'Too many comment requests. Please try again later.',
  skipInTest: true,
});