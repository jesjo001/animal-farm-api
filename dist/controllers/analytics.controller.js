"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventTrends = exports.getFinancialTrends = exports.getProductionTrends = exports.getKPIs = void 0;
const analytics_service_1 = require("../services/analytics.service");
const tsyringe_1 = require("tsyringe");
const analyticsService = tsyringe_1.container.resolve(analytics_service_1.AnalyticsService);
const getKPIs = async (req, res, next) => {
    try {
        const kpis = await analyticsService.getKPIs(req.tenantId);
        res.json({
            success: true,
            data: kpis,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getKPIs = getKPIs;
const getProductionTrends = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const trends = await analyticsService.getProductionTrends(req.tenantId, days);
        res.json({
            success: true,
            data: trends,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductionTrends = getProductionTrends;
const getFinancialTrends = async (req, res, next) => {
    try {
        const months = parseInt(req.query.months) || 12;
        const trends = await analyticsService.getFinancialTrends(req.tenantId, months);
        res.json({
            success: true,
            data: trends,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getFinancialTrends = getFinancialTrends;
const getEventTrends = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const trends = await analyticsService.getEventTrends(req.tenantId, days);
        res.json({
            success: true,
            data: trends,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getEventTrends = getEventTrends;
//# sourceMappingURL=analytics.controller.js.map