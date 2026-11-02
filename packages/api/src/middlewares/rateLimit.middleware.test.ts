
import express from 'express';
import request from 'supertest';
import { createRateLimiter } from './rateLimit.middleware';

describe('Rate Limit Middleware', () => {
  const createTestApp = (limit: number) => {
    const app = express();

    app.use(
      createRateLimiter({
        windowMs: 60 * 1000,
        limit,
        message: 'Too many requests. Please try again later.',
      })
    );

    app.get('/test', (_req, res) => {
      res.status(200).json({
        success: true,
        message: 'Request successful',
      });
    });

    return app;
  };

  it('should allow requests within the configured limit', async () => {
    const app = createTestApp(3);

    const firstResponse = await request(app).get('/test');
    const secondResponse = await request(app).get('/test');
    const thirdResponse = await request(app).get('/test');

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(thirdResponse.status).toBe(200);
  });

  it('should reject requests exceeding the configured limit', async () => {
    const app = createTestApp(2);

    await request(app).get('/test');
    await request(app).get('/test');

    const response = await request(app).get('/test');

    expect(response.status).toBe(429);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      'Too many requests. Please try again later.'
    );
  });

  it('should include standard rate limit headers', async () => {
    const app = createTestApp(2);

    const response = await request(app).get('/test');

    expect(response.headers['ratelimit']).toBeDefined();
  });
});
