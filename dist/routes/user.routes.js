"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const planEnforcement_middleware_1 = require("../middlewares/planEnforcement.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// Profile routes for the authenticated user
router.get('/profile', user_controller_1.getProfile);
router.put('/profile', user_controller_1.updateProfile);
// User management routes
router.get('/', (0, auth_middleware_1.authorize)('tenant_admin', 'manager'), user_controller_1.getUsers);
router.post('/', (0, auth_middleware_1.authorize)('tenant_admin', 'manager'), (0, planEnforcement_middleware_1.checkPlanEnforcement)('users'), user_controller_1.createUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map