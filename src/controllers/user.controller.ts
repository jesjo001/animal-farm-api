import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { container } from 'tsyringe';

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