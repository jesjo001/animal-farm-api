import { Request, Response, NextFunction } from 'express';
/**
 * Rate limiter for OpenAI-powered endpoints
 * Prevents excessive API usage
 */
export declare const openAIRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Tenant-specific rate limiter
 */
export declare const tenantAnalysisLimiter: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=openai.rateLimit.middleware.d.ts.map