import { Router } from 'express';
import { getTransactions, createTransaction, getTransaction, updateTransaction, deleteTransaction } from '../controllers/transaction.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { tenantContext } from '../middlewares/tenantContext.middleware';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantContext);

router.get('/', getTransactions);
router.post('/', authorize('tenant_admin', 'manager', 'accountant'), createTransaction);
router.get('/:id', getTransaction);
router.put('/:id', authorize('tenant_admin', 'manager', 'accountant'), updateTransaction);
router.delete('/:id', authorize('tenant_admin', 'manager'), deleteTransaction);

export default router;