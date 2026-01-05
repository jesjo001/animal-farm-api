import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt.util';
import { BaseRepository } from '../repositories/BaseRepository';
import { UnauthorizedError } from '../utils/errors';
import { container } from 'tsyringe';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJWT(token);

    const userRepository = container.resolve<BaseRepository<any>>('UserRepository');
    const user = await userRepository.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid token');
    }

    console.log('Authenticated user:', user);
    req.user = user;
    req.tenantId = user.tenantId.toString();
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new UnauthorizedError('Insufficient permissions');
      next(error);
    } else {
      next();
    }
  };
};