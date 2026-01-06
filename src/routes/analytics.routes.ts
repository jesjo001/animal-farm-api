import { Router } from 'express';
import { getFinancialSummary } from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantContext);

router.get('/financial-summary', getFinancialSummary);

export default router;
