"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const production_controller_1 = require("../controllers/production.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const tenantContext_middleware_1 = require("../middlewares/tenantContext.middleware");
const router = (0, express_1.Router)();
// All routes require authentication and tenant context
router.use(auth_middleware_1.authenticate);
router.use(tenantContext_middleware_1.tenantContext);
router.get('/', production_controller_1.getProductions);
router.get('/stats', production_controller_1.getProductionStats);
router.get('/chart', production_controller_1.getProductionChart);
router.post('/', (0, auth_middleware_1.authorize)('tenant_admin', 'manager', 'worker'), production_controller_1.createProduction);
router.get('/:id', production_controller_1.getProduction);
router.put('/:id', (0, auth_middleware_1.authorize)('tenant_admin', 'manager'), production_controller_1.updateProduction);
router.delete('/:id', (0, auth_middleware_1.authorize)('tenant_admin'), production_controller_1.deleteProduction);
exports.default = router;
//# sourceMappingURL=production.routes.js.map