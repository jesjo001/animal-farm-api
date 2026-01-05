import { Router } from 'express';
import authRoutes from './auth.routes';
import animalRoutes from './animal.routes';
import productionRoutes from './production.routes';
import dashboardRoutes from './dashboard.routes';
import analyticsRoutes from './analytics.routes';
import tenantRoutes from './tenant.routes';
import eventRoutes from './event.routes';
import transactionRoutes from './transaction.routes';
import userRoutes from './user.routes';
import locationRoutes from './location.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/animals', animalRoutes);
router.use('/productions', productionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/tenants', tenantRoutes);
router.use('/events', eventRoutes);
router.use('/transactions', transactionRoutes);
router.use('/users', userRoutes);
router.use('/locations', locationRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'FarmFlow API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;