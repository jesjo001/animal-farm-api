import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ForbiddenError } from '../utils/errors';
import { TenantService } from '../services/tenant.service';
import { AnimalService } from '../services/animal.service';
import { AuthService } from '../services/auth.service';

const PLAN_LIMITS: Record<string, Record<string, number | boolean>> = {
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

type Feature = 'animals' | 'users' | 'analytics';

export const checkPlanEnforcement = (feature: Feature) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) {
        return next(new ForbiddenError('Tenant information is missing.'));
      }

      const tenantService = container.resolve(TenantService);
      const tenant = await tenantService.getTenantById(tenantId);
      if (!tenant) {
        return next(new ForbiddenError('Tenant not found.'));
      }

      const plan = tenant.subscriptionPlan || 'free';
      const limit = PLAN_LIMITS[plan][feature];

      if (feature === 'analytics') {
        if (!limit) {
          return next(new ForbiddenError('Your plan does not include access to analytics.'));
        }
      } else {
        let currentCount = 0;
        if (feature === 'animals') {
          const animalService = container.resolve(AnimalService);
          currentCount = await animalService.count({ tenantId });
        } else if (feature === 'users') {
          const authService = container.resolve(AuthService);
          const users = await authService.getUsersByTenant(tenantId);
          currentCount = users.length;
        }

        if (typeof limit === 'number' && currentCount >= limit) {
          return next(new ForbiddenError(`You have reached the limit of ${limit} ${feature} for your plan.`));
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
