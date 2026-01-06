import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { container } from 'tsyringe';

const analyticsService = container.resolve(AnalyticsService);

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await analyticsService.getKPIs(req.tenantId!);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboard = await analyticsService.getDashboardData(req.tenantId!);

    res.json({
      success: true,
      data: dashboard.recentActivity,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductionChart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const chart = await analyticsService.getProductionTrends(req.tenantId!, days);

    res.json({
      success: true,
      data: chart,
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueChart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const chart = await analyticsService.getFinancialTrends(req.tenantId!, startDate, endDate);

    res.json({
      success: true,
      data: chart,
    });
  } catch (error) {
    next(error);
  }
};