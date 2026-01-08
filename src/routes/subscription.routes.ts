import { Router } from 'express';
import { createSubscription } from '../controllers/subscription.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantContext);

router.post('/', createSubscription);

export default router;