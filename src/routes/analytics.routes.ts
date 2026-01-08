import { Router } from 'express';
import { getFinancialSummary, getComprehensiveAnalytics } from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';
import { checkPlanEnforcement } from '../middlewares/planEnforcement.middleware';

const router = Router();

// All routes require authentication, tenant context, and analytics plan
router.use(authenticate);
router.use(tenantContext);
router.use(checkPlanEnforcement('analytics'));

router.get('/financial-summary', getFinancialSummary);
router.get('/comprehensive', getComprehensiveAnalytics);

export default router;
