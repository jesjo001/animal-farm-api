"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinancialSummary = void 0;
const analytics_service_1 = require("../services/analytics.service");
const tsyringe_1 = require("tsyringe");
const analyticsService = tsyringe_1.container.resolve(analytics_service_1.AnalyticsService);
const getFinancialSummary = async (req, res, next) => {
    try {
        const { period = '6months' } = req.query;
        let startDate;
        const endDate = new Date();
        switch (period) {
            case '1month':
                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
                break;
            case '3months':
                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, endDate.getDate());
                break;
            case '1year':
                startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
                break;
            case '6months':
            default:
                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 6, endDate.getDate());
                break;
        }
        const summary = await analyticsService.getFinancialSummary(req.tenantId, startDate, endDate);
        res.json({ success: true, data: summary });
    }
    catch (error) {
        next(error);
    }
};
exports.getFinancialSummary = getFinancialSummary;
//# sourceMappingURL=analytics.controller.js.map