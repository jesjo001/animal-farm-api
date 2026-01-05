import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';

export const tenantContext = (req: Request, res: Response, next: NextFunction) => {
  if (!req.tenantId) {
    throw new UnauthorizedError('Tenant context missing');
  }
  next();
};