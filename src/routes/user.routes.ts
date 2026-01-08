import { Router } from 'express';
import { getProfile, updateProfile, createUser, getUsers } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { checkPlanEnforcement } from '../middlewares/planEnforcement.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile routes for the authenticated user
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// User management routes
router.get('/', authorize('tenant_admin', 'manager'), getUsers);
router.post('/', authorize('tenant_admin', 'manager'), checkPlanEnforcement('users'), createUser);

export default router;