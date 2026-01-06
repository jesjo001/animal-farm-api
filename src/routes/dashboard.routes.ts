import { Router } from 'express';
import {
  getDashboardStats,
  getRecentActivity,
  getProductionChart,
  getRevenueChart,
} from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantContext);

router.get('/stats', getDashboardStats);
router.get('/recent-activity', getRecentActivity);
router.get('/production-chart', getProductionChart);
router.get('/revenue-chart', getRevenueChart);

export default router;