// src/middlewares/openai.rateLimit.middleware.ts

import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

/**
 * Rate limiter for OpenAI-powered endpoints
 * Prevents excessive API usage
 */
export const openAIRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Max 20 requests per minute per IP
  message: 'Too many analysis requests. Please try again in a minute.',
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Tenant-specific rate limiter
 */
export const tenantAnalysisLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tenantId = (req as any).tenantId;
  
  // Check if tenant has exceeded daily OpenAI quota
  const cacheKey = `openai:usage:${tenantId}:${new Date().toISOString().split('T')[0]}`;
  
  // Implement Redis-based rate limiting here if needed
  // For now, just log
  logger.info(`OpenAI request from tenant ${tenantId}`);
  next();
};