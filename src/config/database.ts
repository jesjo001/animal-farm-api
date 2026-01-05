import mongoose from 'mongoose';
import { env } from './env';
import logger from './logger';

const connectDB = async (): Promise<void> => {
  try {
    const uri = env.NODE_ENV === 'test' ? env.MONGODB_TEST_URI || env.MONGODB_URI : env.MONGODB_URI;

    await mongoose.connect(uri);

    logger.info('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;