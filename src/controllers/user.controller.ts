import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { container } from 'tsyringe';
import { AppError } from '../utils/errors';

const authService = container.resolve(AuthService);

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getUserById(req.user!.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.updateUser(req.user!.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await authService.getUsersByTenant(req.user!.tenantId);
    const mappedUsers = users.map(user => ({
      ...user.toObject(),
      id: user._id.toString(),
    }));
    res.json({ success: true, data: mappedUsers });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loggedInUserRole = req.user!.role;
    const { role: roleToCreate } = req.body;

    if (loggedInUserRole === 'manager' && roleToCreate !== 'worker') {
      throw new AppError('Managers can only create workers.', 403);
    }
    
    if (loggedInUserRole === 'tenant_admin' && !['manager', 'worker', 'viewer'].includes(roleToCreate)) {
        throw new AppError('Admins can only create managers, workers, or viewers.', 403);
    }

    const newUser = await authService.createUser({
      ...req.body,
      tenantId: req.user!.tenantId,
    });
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
};
