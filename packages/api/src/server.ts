import http from 'http';
import app from './app';
import { env } from '@config/env';
import logger from '@config/logger';
import { prisma } from '@db/prisma';

const server = http.createServer(app);

const startServer = async (): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connected successfully');

    server.listen(env.apiPort, env.apiHost, () => {
      logger.info(
        `Server running at http://${env.apiHost}:${env.apiPort}`
      );
      logger.info(`Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} signal received: closing HTTP server`);

  server.close(async () => {
    logger.info('HTTP server closed');

    await prisma.$disconnect();
    logger.info('Database disconnected');

    process.exit(0);
  });

  setTimeout(() => {
    logger.error(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();