"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("./logger"));
const connectDB = async () => {
    try {
        const uri = env_1.env.NODE_ENV === 'test' ? env_1.env.MONGODB_TEST_URI || env_1.env.MONGODB_URI : env_1.env.MONGODB_URI;
        await mongoose_1.default.connect(uri);
        logger_1.default.info('MongoDB connected successfully');
        // Handle connection events
        mongoose_1.default.connection.on('error', (err) => {
            logger_1.default.error('MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.default.warn('MongoDB disconnected');
        });
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            logger_1.default.info('MongoDB connection closed through app termination');
            process.exit(0);
        });
    }
    catch (error) {
        logger_1.default.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map