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
    // Log the authorization attempt for debugging
    if (req.user) {
      console.log(
        `Authorizing user ${req.user.email}. Role: "${req.user.role}" (length: ${req.user.role.length}). Required roles: [${roles.join(', ')}]`
      );
      const charCodes = req.user.role.split('').map(c => c.charCodeAt(0)).join(', ');
      console.log(`Role char codes: [${charCodes}]`);
    }

    const userRole = req.user?.role?.trim(); // Trim potential whitespace

    if (!req.user || !userRole || !roles.includes(userRole)) {
      const error = new UnauthorizedError('Insufficient permissions');
      next(error);
    } else {
      next();
    }
  };
};