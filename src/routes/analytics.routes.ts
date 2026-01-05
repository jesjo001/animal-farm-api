import { Router } from 'express';
import {
  getKPIs,
  getProductionTrends,
  getFinancialTrends,
  getEventTrends,
} from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantContext);

router.get('/kpis', getKPIs);
router.get('/production-trends', getProductionTrends);
router.get('/financial-trends', getFinancialTrends);
router.get('/event-trends', getEventTrends);

export default router;