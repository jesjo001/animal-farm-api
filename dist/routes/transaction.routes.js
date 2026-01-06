"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const tenantContext_middleware_1 = require("../middlewares/tenantContext.middleware");
const router = (0, express_1.Router)();
// All routes require authentication and tenant context
router.use(auth_middleware_1.authenticate);
router.use(tenantContext_middleware_1.tenantContext);
router.get('/', transaction_controller_1.getTransactions);
router.get('/summary', transaction_controller_1.getFinancialSummary);
router.post('/', (0, auth_middleware_1.authorize)('tenant_admin', 'manager', 'accountant'), transaction_controller_1.createTransaction);
router.get('/:id', transaction_controller_1.getTransaction);
router.put('/:id', (0, auth_middleware_1.authorize)('tenant_admin', 'manager', 'accountant'), transaction_controller_1.updateTransaction);
router.delete('/:id', (0, auth_middleware_1.authorize)('tenant_admin', 'manager'), transaction_controller_1.deleteTransaction);
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map