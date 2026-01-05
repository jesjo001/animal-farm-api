"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimiter = exports.authRateLimiter = exports.createRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../config/env");
const createRateLimiter = () => {
    return (0, express_rate_limit_1.default)({
        windowMs: env_1.env.RATE_LIMIT_WINDOW_MS,
        max: env_1.env.RATE_LIMIT_MAX_REQUESTS,
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
exports.createRateLimiter = createRateLimiter;
exports.authRateLimiter = (0, express_rate_limit_1.default)({
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
exports.apiRateLimiter = (0, exports.createRateLimiter)();
//# sourceMappingURL=rateLimiter.middleware.js.map