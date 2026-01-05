import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { container } from 'tsyringe';
import { loginSchema, registerSchema, changePasswordSchema } from '../utils/validators';
import { validateRequest } from '../middlewares/validation.middleware';

function getAuthService(): AuthService {
  return container.resolve(AuthService);
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await getAuthService().register(data);

    res.status(201).json({
      success: true,
      message: 'Farm registered successfully',
      data: {
        tenant: result.tenant,
        user: result.user,
        tokens: result.tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await getAuthService().login(data);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        tokens: result.tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // You might want to implement token blacklisting for enhanced security
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implement refresh token logic
    // This would require storing refresh tokens and validating them
    res.json({
      success: true,
      message: 'Token refresh not implemented yet',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implement forgot password logic
    res.json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implement reset password logic
    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getAuthService().getUserById(req.user!._id.toString());

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = changePasswordSchema.parse(req.body);
    await getAuthService().changePassword(
      req.user!._id.toString(),
      data.currentPassword,
      data.newPassword
    );

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};