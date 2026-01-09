import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ReferralService } from '../services/referral.service';

export const generateReferralCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const referralService = container.resolve(ReferralService);
    const code = await referralService.generateReferralCode(req.user!._id.toString());
    res.status(200).json({ code });
  } catch (error) {
    next(error);
  }
};

export const getReferralDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const referralService = container.resolve(ReferralService);
    const dashboardData = await referralService.getReferralDashboard(req.user!._id.toString());
    res.status(200).json(dashboardData);
  } catch (error) {
    next(error);
  }
};
