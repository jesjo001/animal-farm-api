"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.string().transform(Number).default('3000'),
    MONGODB_URI: zod_1.z.string(),
    MONGODB_TEST_URI: zod_1.z.string().optional(),
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('30d'),
    EMAIL_HOST: zod_1.z.string().optional(),
    EMAIL_PORT: zod_1.z.string().transform(Number).optional(),
    EMAIL_USER: zod_1.z.string().optional(),
    EMAIL_PASS: zod_1.z.string().optional(),
    UPLOAD_PATH: zod_1.z.string().default('uploads/'),
    MAX_FILE_SIZE: zod_1.z.string().transform(Number).default('5242880'),
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().transform(Number).default('900000'),
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.string().transform(Number).default('100'),
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    API_DOCS_ENABLED: zod_1.z.string().transform((val) => val === 'true').default('true'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Environment validation failed:', parsed.error.format());
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map