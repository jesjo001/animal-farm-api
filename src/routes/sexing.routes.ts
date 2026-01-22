// src/routes/sexing.routes.ts
import { Router } from 'express';
import { ChickSexingController } from '../controllers/sexing.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';
import { openAIRateLimiter, tenantAnalysisLimiter } from '../middlewares/openai.rateLimit.middleware';
import { upload } from '../middlewares/upload.middleware';
import { body } from 'express-validator';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantContext);

// Apply rate limiters
router.use(openAIRateLimiter);
router.use(tenantAnalysisLimiter);

router.post(
    '/analyze/single',
    upload.single('audio'),
    ChickSexingController.analyzeSingle
);

router.post(
    '/analyze/batch',
    upload.array('audio', 50), // Allow up to 50 files
    [
        body('name').notEmpty().withMessage('Batch name is required.')
    ],
    ChickSexingController.analyzeBatch
);

router.get(
    '/stats',
    ChickSexingController.getSexingStats
);

router.get(
    '/batches',
    ChickSexingController.getSexingBatches
);

export default router;