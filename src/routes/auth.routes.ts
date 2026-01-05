import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  changePassword,
} from '../controllers/auth.controller';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes with rate limiting
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.use(authenticate);
router.post('/logout', logout);
router.get('/me', getMe);
router.post('/change-password', changePassword);

export default router;