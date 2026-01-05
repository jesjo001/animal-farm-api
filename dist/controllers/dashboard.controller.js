"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductionChart = exports.getRecentActivity = exports.getDashboardStats = void 0;
const analytics_service_1 = require("../services/analytics.service");
const tsyringe_1 = require("tsyringe");
const analyticsService = tsyringe_1.container.resolve(analytics_service_1.AnalyticsService);
const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await analyticsService.getKPIs(req.tenantId);
        res.json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
const getRecentActivity = async (req, res, next) => {
    try {
        const dashboard = await analyticsService.getDashboardData(req.tenantId);
        res.json({
            success: true,
            data: dashboard.recentActivity,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRecentActivity = getRecentActivity;
const getProductionChart = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const chart = await analyticsService.getProductionTrends(req.tenantId, days);
        res.json({
            success: true,
            data: chart,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductionChart = getProductionChart;
//# sourceMappingURL=dashboard.controller.js.map