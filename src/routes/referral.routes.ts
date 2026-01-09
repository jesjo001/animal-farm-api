import { Router } from 'express';
import { generateReferralCode, getReferralDashboard } from '../controllers/referral.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);

router.post('/generate-code', authorize('tenant_admin', 'worker', 'manager'), generateReferralCode);
router.get('/dashboard', authorize('tenant_admin', 'manager', 'worker'), getReferralDashboard);

export default router;
