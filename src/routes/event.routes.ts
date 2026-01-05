import { Router } from 'express';
import { getEvents, createEvent, getEvent, updateEvent, deleteEvent } from '../controllers/event.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantContext);

router.get('/', getEvents);
router.post('/', authorize('tenant_admin', 'manager'), createEvent);
router.get('/:id', getEvent);
router.put('/:id', authorize('tenant_admin', 'manager'), updateEvent);
router.delete('/:id', authorize('tenant_admin', 'manager'), deleteEvent);

export default router;