export declare const env: {
    NODE_ENV: "development" | "test" | "production";
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
    UPLOAD_PATH: string;
    MAX_FILE_SIZE: number;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    LOG_LEVEL: "error" | "warn" | "info" | "debug";
    API_DOCS_ENABLED: boolean;
    MONGODB_TEST_URI?: string | undefined;
    EMAIL_HOST?: string | undefined;
    EMAIL_PORT?: number | undefined;
    EMAIL_USER?: string | undefined;
    EMAIL_PASS?: string | undefined;
};
//# sourceMappingURL=env.d.ts.map