import { Router } from 'express';
import {
  getAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  addWeightRecord,
  getWeightHistory,
  getAnimalStats,
} from '../controllers/animal.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantContext);

router.get('/', getAnimals);
router.get('/stats', getAnimalStats);
router.post('/', authorize('tenant_admin', 'manager'), createAnimal);
router.get('/:id', getAnimal);
router.put('/:id', authorize('tenant_admin', 'manager'), updateAnimal);
router.delete('/:id', authorize('tenant_admin'), deleteAnimal);
router.post('/:id/weight', authorize('tenant_admin', 'manager', 'worker'), addWeightRecord);
router.get('/:id/weight-history', getWeightHistory);

export default router;