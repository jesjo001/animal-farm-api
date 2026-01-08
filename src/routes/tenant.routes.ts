import { Router } from 'express';
import { createTenant, getTenant, getTenantProfile, updateTenantProfile, updateSubscriptionPlan } from '../controllers/tenant.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All tenant routes require authentication
router.use(authenticate);

// Routes for tenant admins to manage their own profile
router.get('/profile', authorize('tenant_admin'), getTenantProfile);
router.put('/profile', authorize('tenant_admin'), updateTenantProfile);
router.put('/plan', authorize('tenant_admin'), updateSubscriptionPlan);

// Only super admin can create or get other tenants
router.post('/', authorize('super_admin'), createTenant);
router.get('/:id', authorize('super_admin'), getTenant);

export default router;