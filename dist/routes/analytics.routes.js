"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const tenantContext_middleware_1 = require("../middlewares/tenantContext.middleware");
const router = (0, express_1.Router)();
// All routes require authentication and tenant context
router.use(auth_middleware_1.authenticate);
router.use(tenantContext_middleware_1.tenantContext);
router.get('/kpis', analytics_controller_1.getKPIs);
router.get('/production-trends', analytics_controller_1.getProductionTrends);
router.get('/financial-trends', analytics_controller_1.getFinancialTrends);
router.get('/event-trends', analytics_controller_1.getEventTrends);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map