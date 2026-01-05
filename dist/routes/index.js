"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const animal_routes_1 = __importDefault(require("./animal.routes"));
const production_routes_1 = __importDefault(require("./production.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const analytics_routes_1 = __importDefault(require("./analytics.routes"));
const tenant_routes_1 = __importDefault(require("./tenant.routes"));
const event_routes_1 = __importDefault(require("./event.routes"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const router = (0, express_1.Router)();
// API routes
router.use('/auth', auth_routes_1.default);
router.use('/animals', animal_routes_1.default);
router.use('/productions', production_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/analytics', analytics_routes_1.default);
router.use('/tenants', tenant_routes_1.default);
router.use('/events', event_routes_1.default);
router.use('/transactions', transaction_routes_1.default);
router.use('/users', user_routes_1.default);
// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'FarmFlow API is running',
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map