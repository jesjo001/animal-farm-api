"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const tenantContext_middleware_1 = require("../middlewares/tenantContext.middleware");
const planEnforcement_middleware_1 = require("../middlewares/planEnforcement.middleware");
const router = (0, express_1.Router)();
// All routes require authentication, tenant context, and analytics plan
router.use(auth_middleware_1.authenticate);
router.use(tenantContext_middleware_1.tenantContext);
router.use((0, planEnforcement_middleware_1.checkPlanEnforcement)('analytics'));
router.get('/financial-summary', analytics_controller_1.getFinancialSummary);
router.get('/comprehensive', analytics_controller_1.getComprehensiveAnalytics);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map