import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  apiHost: process.env.API_HOST || '0.0.0.0',
  apiPort: parseInt(process.env.API_PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate critical environment variables
if (!env.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (!env.jwtSecret || env.jwtSecret === 'dev_secret') {
  if (env.nodeEnv === 'production') {
    throw new Error(
      'JWT_SECRET must be set to a strong value in production'
    );
  }
}