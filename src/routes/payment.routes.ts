import { Router } from 'express';
import { initiatePayment, verifyPayment, handleWebhook } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';

const router = Router();

// Webhook endpoint (no auth required for webhooks)
router.post('/webhook', handleWebhook);

// Protected routes
router.use(authenticate);
router.use(tenantContext);

router.post('/initiate', initiatePayment);
router.get('/verify/:transactionId', verifyPayment);

export default router;