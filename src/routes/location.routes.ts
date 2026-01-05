import { Router } from 'express';
import { createLocation, getTenantLocations } from '../controllers/location.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/create', createLocation);

router.get('/', getTenantLocations);

export default router;
