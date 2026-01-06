"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tenant_controller_1 = require("../controllers/tenant.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// All tenant routes require authentication
router.use(auth_middleware_1.authenticate);
// Routes for tenant admins to manage their own profile
router.get('/profile', (0, auth_middleware_1.authorize)('tenant_admin'), tenant_controller_1.getTenantProfile);
router.put('/profile', (0, auth_middleware_1.authorize)('tenant_admin'), tenant_controller_1.updateTenantProfile);
// Only super admin can create or get other tenants
router.post('/', (0, auth_middleware_1.authorize)('super_admin'), tenant_controller_1.createTenant);
router.get('/:id', (0, auth_middleware_1.authorize)('super_admin'), tenant_controller_1.getTenant);
exports.default = router;
//# sourceMappingURL=tenant.routes.js.map