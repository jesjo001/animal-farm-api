"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductionChart = exports.getProductionStats = exports.deleteProduction = exports.updateProduction = exports.createProduction = exports.getProduction = exports.getProductions = void 0;
const production_service_1 = require("../services/production.service");
const tsyringe_1 = require("tsyringe");
const validators_1 = require("../utils/validators");
const pagination_util_1 = require("../utils/pagination.util");
const productionService = tsyringe_1.container.resolve(production_service_1.ProductionService);
const getProductions = async (req, res, next) => {
    try {
        const options = (0, pagination_util_1.getPaginationOptions)(req.query);
        const filters = { tenantId: req.tenantId };
        if (req.query.startDate && req.query.endDate) {
            filters.date = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate),
            };
        }
        const result = await productionService.getProductions(filters, options);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductions = getProductions;
const getProduction = async (req, res, next) => {
    try {
        const production = await productionService.getProductionById(req.params.id, req.tenantId);
        res.json({
            success: true,
            data: production,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProduction = getProduction;
const createProduction = async (req, res, next) => {
    try {
        const data = validators_1.createProductionSchema.parse(req.body);
        const production = await productionService.createProduction(data, req.tenantId, req.user._id.toString());
        res.status(201).json({
            success: true,
            message: 'Production record created successfully',
            data: production,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProduction = createProduction;
const updateProduction = async (req, res, next) => {
    try {
        const data = req.body;
        const production = await productionService.updateProduction(req.params.id, data, req.tenantId, req.user._id.toString());
        res.json({
            success: true,
            message: 'Production record updated successfully',
            data: production,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduction = updateProduction;
const deleteProduction = async (req, res, next) => {
    try {
        await productionService.deleteProduction(req.params.id, req.tenantId, req.user._id.toString());
        res.json({
            success: true,
            message: 'Production record deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduction = deleteProduction;
const getProductionStats = async (req, res, next) => {
    try {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        const stats = await productionService.getProductionStats(req.tenantId, startDate, endDate);
        res.json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductionStats = getProductionStats;
const getProductionChart = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const chart = await productionService.getProductionChart(req.tenantId, new Date(Date.now() - days * 24 * 60 * 60 * 1000), new Date());
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
//# sourceMappingURL=production.controller.js.map