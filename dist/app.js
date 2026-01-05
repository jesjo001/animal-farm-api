"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const rateLimiter_middleware_1 = require("./middlewares/rateLimiter.middleware");
const logger_1 = __importDefault(require("./config/logger"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
}));
// Rate limiting
app.use(rateLimiter_middleware_1.apiRateLimiter);
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Compression
app.use((0, compression_1.default)());
// Logging
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    next();
});
// API documentation
if (env_1.env.API_DOCS_ENABLED) {
    // Swagger setup would go here
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup({}));
}
// Routes
app.use('/api', routes_1.default);
// Error handling
app.use(errorHandler_middleware_1.notFoundHandler);
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map