import { Router } from 'express';
import {
  getTrainingModelInfo,
  getTrainingStats,
  getTrainingSamples,
  startTraining,
  validateTrainingSample,
  deleteTrainingSamples
} from '../controllers/training.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';

const router = Router();

router.use(authenticate);
router.use(tenantContext);
router.use(authorize('tenant_admin'));

router.get('/model-info', getTrainingModelInfo);
router.get('/stats', getTrainingStats);
router.get('/samples', getTrainingSamples);
router.post('/start', startTraining);
router.post('/samples/:id/validate', validateTrainingSample);
router.delete('/samples', deleteTrainingSamples);

export default router;
