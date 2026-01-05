import "reflect-metadata";
import './config/container'; // Initialize dependency injection FIRST
import app from './app';
import connectDB from './config/database';
import { env } from './config/env';
import logger from './config/logger';

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`FarmFlow API server running on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      if (env.API_DOCS_ENABLED) {
        logger.info(`API Documentation available at http://localhost:${env.PORT}/api-docs`);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();