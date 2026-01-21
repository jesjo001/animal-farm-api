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
    if (!req.user) {
        console.error('Authorization check failed: req.user is not defined.');
        return next(new UnauthorizedError('Insufficient permissions: Not authenticated.'));
    }

    const userRole = req.user.role?.trim();
    console.log(`--- Authorization Check ---`);
    console.log(`User: ${req.user.email}`);
    console.log(`User Role (raw): "${req.user.role}" (type: ${typeof req.user.role})`);
    console.log(`User Role (trimmed): "${userRole}" (type: ${typeof userRole})`);
    console.log(`Required Roles: [${roles.join(', ')}] (type: ${typeof roles})`);

    if (!userRole) {
        console.error('Authorization check failed: userRole is undefined or empty after trim.');
        return next(new UnauthorizedError('Insufficient permissions: Invalid user role.'));
    }

    // Superadmin has access to everything
    if (userRole === 'superadmin') {
        console.log('User is superadmin, granting access.');
        return next();
    }
    
    console.log(`Checking if user role "${userRole}" is in required roles...`); 
    const isIncluded = roles.includes(userRole);
    console.log(`Check: roles.includes(userRole) => ${isIncluded}`);

    if (!isIncluded) {
      const error = new UnauthorizedError('Insufficient permissions');
      next(error);
    } else {
      console.log(`Authorization successful.`);
      next();
    }
  };
};