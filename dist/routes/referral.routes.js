"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const referral_controller_1 = require("../controllers/referral.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/generate-code', (0, auth_middleware_1.authorize)('tenant_admin', 'worker', 'manager'), referral_controller_1.generateReferralCode);
router.get('/dashboard', (0, auth_middleware_1.authorize)('tenant_admin', 'manager', 'worker'), referral_controller_1.getReferralDashboard);
exports.default = router;
//# sourceMappingURL=referral.routes.js.map