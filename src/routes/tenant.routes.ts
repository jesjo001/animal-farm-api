import { Router } from 'express';
import { createTenant, getTenant } from '../controllers/tenant.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All tenant routes require authentication
router.use(authenticate);

// Only super admin can create tenants
router.post('/', authorize('super_admin'), createTenant);
router.get('/:id', authorize('super_admin'), getTenant);

export default router;