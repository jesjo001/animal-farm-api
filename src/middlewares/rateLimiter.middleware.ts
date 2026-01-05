import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const createRateLimiter = () => {
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: {
      success: false,
      error: {
        message: 'Too many requests from this IP, please try again later.',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiRateLimiter = createRateLimiter();