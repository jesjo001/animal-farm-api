"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../config/logger"));
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    if (error instanceof errors_1.AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // Log error
    logger_1.default.error({
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id,
        tenantId: req.tenantId,
    });
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        },
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, next) => {
    const error = new errors_1.AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.middleware.js.map