"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const tenantContext_middleware_1 = require("../middlewares/tenantContext.middleware");
const router = (0, express_1.Router)();
// Webhook endpoint (no auth required for webhooks)
router.post('/webhook', payment_controller_1.handleWebhook);
// Protected routes
router.use(auth_middleware_1.authenticate);
router.use(tenantContext_middleware_1.tenantContext);
router.post('/initiate', payment_controller_1.initiatePayment);
router.get('/verify/:transactionId', payment_controller_1.verifyPayment);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map