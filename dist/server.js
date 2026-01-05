"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("./config/container"); // Initialize dependency injection FIRST
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const env_1 = require("./config/env");
const logger_1 = __importDefault(require("./config/logger"));
const scheduler_service_1 = require("./services/scheduler.service");
const startServer = async () => {
    console.log("Starting server...");
    try {
        // Connect to database
        console.log("Connecting to database...");
        await (0, database_1.default)();
        console.log("Database connected.");
        // Start server
        console.log("Starting Express server...");
        const server = app_1.default.listen(env_1.env.PORT, () => {
            console.log("Server started.");
            logger_1.default.info(`FarmFlow API server running on port ${env_1.env.PORT}`);
            logger_1.default.info(`Environment: ${env_1.env.NODE_ENV}`);
            if (env_1.env.API_DOCS_ENABLED) {
                logger_1.default.info(`API Documentation available at http://localhost:${env_1.env.PORT}/api-docs`);
            }
        });
        // Start scheduled tasks
        scheduler_service_1.SchedulerService.start();
        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger_1.default.info('SIGTERM received, shutting down gracefully');
            server.close(() => {
                logger_1.default.info('Process terminated');
            });
        });
    }
    catch (error) {
        console.error("Error in startServer:", error);
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map