"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const rateLimiter_middleware_1 = require("../middlewares/rateLimiter.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes with rate limiting
router.post('/register', rateLimiter_middleware_1.authRateLimiter, auth_controller_1.register);
router.post('/login', rateLimiter_middleware_1.authRateLimiter, auth_controller_1.login);
router.post('/refresh-token', auth_controller_1.refreshToken);
router.post('/forgot-password', rateLimiter_middleware_1.authRateLimiter, auth_controller_1.forgotPassword);
router.post('/reset-password', auth_controller_1.resetPassword);
// Protected routes
router.use(auth_middleware_1.authenticate);
router.post('/logout', auth_controller_1.logout);
router.get('/me', auth_controller_1.getMe);
router.post('/change-password', auth_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map