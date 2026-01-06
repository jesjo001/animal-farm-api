"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const tenantContext_middleware_1 = require("../middlewares/tenantContext.middleware");
const router = (0, express_1.Router)();
// All routes require authentication and tenant context
router.use(auth_middleware_1.authenticate);
router.use(tenantContext_middleware_1.tenantContext);
router.get('/stats', dashboard_controller_1.getDashboardStats);
router.get('/recent-activity', dashboard_controller_1.getRecentActivity);
router.get('/production-chart', dashboard_controller_1.getProductionChart);
router.get('/revenue-chart', dashboard_controller_1.getRevenueChart);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map