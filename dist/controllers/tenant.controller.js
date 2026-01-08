"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscriptionPlan = exports.updateTenantProfile = exports.getTenantProfile = exports.getTenant = exports.createTenant = void 0;
const tenant_service_1 = require("../services/tenant.service");
const tsyringe_1 = require("tsyringe");
const tenantService = tsyringe_1.container.resolve(tenant_service_1.TenantService);
const createTenant = async (req, res, next) => {
    try {
        const tenant = await tenantService.createTenant(req.body);
        res.status(201).json({ success: true, data: tenant });
    }
    catch (error) {
        next(error);
    }
};
exports.createTenant = createTenant;
const getTenant = async (req, res, next) => {
    try {
        const tenant = await tenantService.getTenantById(req.params.id);
        res.json({ success: true, data: tenant });
    }
    catch (error) {
        next(error);
    }
};
exports.getTenant = getTenant;
const getTenantProfile = async (req, res, next) => {
    try {
        const tenant = await tenantService.getTenantById(req.tenantId);
        res.json({ success: true, data: tenant });
    }
    catch (error) {
        next(error);
    }
};
exports.getTenantProfile = getTenantProfile;
const updateTenantProfile = async (req, res, next) => {
    try {
        const tenant = await tenantService.updateTenant(req.tenantId, req.body);
        res.json({ success: true, data: tenant });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTenantProfile = updateTenantProfile;
const updateSubscriptionPlan = async (req, res, next) => {
    try {
        const { plan } = req.body;
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const tenant = await tenantService.updateSubscriptionPlan(req.user.tenantId.toString(), plan);
        res.json({ success: true, data: tenant });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSubscriptionPlan = updateSubscriptionPlan;
//# sourceMappingURL=tenant.controller.js.map