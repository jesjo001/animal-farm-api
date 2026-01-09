"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPlanEnforcement = void 0;
const tsyringe_1 = require("tsyringe");
const errors_1 = require("../utils/errors");
const tenant_service_1 = require("../services/tenant.service");
const animal_service_1 = require("../services/animal.service");
const auth_service_1 = require("../services/auth.service");
const PLAN_LIMITS = {
    free: {
        animals: 100,
        users: 1,
        analytics: false,
    },
    basic: {
        animals: 1000,
        users: 5,
        analytics: false,
    },
    pro: {
        animals: 5000,
        users: 10,
        analytics: true,
    },
    business: {
        animals: Infinity,
        users: Infinity,
        analytics: true,
    },
};
const checkPlanEnforcement = (feature) => {
    return async (req, res, next) => {
        try {
            const tenantId = req.tenantId;
            if (!tenantId) {
                return next(new errors_1.ForbiddenError('Tenant information is missing.'));
            }
            const tenantService = tsyringe_1.container.resolve(tenant_service_1.TenantService);
            const tenant = await tenantService.getTenantById(tenantId);
            if (!tenant) {
                return next(new errors_1.ForbiddenError('Tenant not found.'));
            }
            const plan = tenant.subscriptionPlan || 'free';
            const limit = PLAN_LIMITS[plan][feature];
            if (feature === 'analytics') {
                if (!limit) {
                    return next(new errors_1.ForbiddenError('Your plan does not include access to analytics.'));
                }
            }
            else {
                let currentCount = 0;
                if (feature === 'animals') {
                    const animalService = tsyringe_1.container.resolve(animal_service_1.AnimalService);
                    currentCount = await animalService.count({ tenantId });
                }
                else if (feature === 'users') {
                    const authService = tsyringe_1.container.resolve(auth_service_1.AuthService);
                    const users = await authService.getUsersByTenant(tenantId);
                    currentCount = users.length;
                }
                if (typeof limit === 'number' && currentCount >= limit) {
                    return next(new errors_1.ForbiddenError(`You have reached the limit of ${limit} ${feature} for your plan.`));
                }
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkPlanEnforcement = checkPlanEnforcement;
//# sourceMappingURL=planEnforcement.middleware.js.map