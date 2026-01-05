import { Router } from 'express';
import {
  getProductions,
  getProduction,
  createProduction,
  updateProduction,
  deleteProduction,
  getProductionStats,
  getProductionChart,
} from '../controllers/production.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantContext);

router.get('/', getProductions);
router.get('/stats', getProductionStats);
router.get('/chart', getProductionChart);
router.post('/', authorize('tenant_admin', 'manager', 'worker'), createProduction);
router.get('/:id', getProduction);
router.put('/:id', authorize('tenant_admin', 'manager'), updateProduction);
router.delete('/:id', authorize('tenant_admin'), deleteProduction);

export default router;