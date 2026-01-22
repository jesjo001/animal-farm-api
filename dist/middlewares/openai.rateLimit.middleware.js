"use strict";
// src/middlewares/openai.rateLimit.middleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantAnalysisLimiter = exports.openAIRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = __importDefault(require("../config/logger"));
/**
 * Rate limiter for OpenAI-powered endpoints
 * Prevents excessive API usage
 */
exports.openAIRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // Max 20 requests per minute per IP
    message: 'Too many analysis requests. Please try again in a minute.',
    standardHeaders: true,
    legacyHeaders: false
});
/**
 * Tenant-specific rate limiter
 */
const tenantAnalysisLimiter = async (req, res, next) => {
    const tenantId = req.tenantId;
    // Check if tenant has exceeded daily OpenAI quota
    const cacheKey = `openai:usage:${tenantId}:${new Date().toISOString().split('T')[0]}`;
    // Implement Redis-based rate limiting here if needed
    // For now, just log
    logger_1.default.info(`OpenAI request from tenant ${tenantId}`);
    next();
};
exports.tenantAnalysisLimiter = tenantAnalysisLimiter;
//# sourceMappingURL=openai.rateLimit.middleware.js.map