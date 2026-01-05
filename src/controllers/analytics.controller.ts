import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { container } from 'tsyringe';

const analyticsService = container.resolve(AnalyticsService);

export const getKPIs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const kpis = await analyticsService.getKPIs(req.tenantId!);

    res.json({
      success: true,
      data: kpis,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductionTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trends = await analyticsService.getProductionTrends(req.tenantId!, days);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

export const getFinancialTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const months = parseInt(req.query.months as string) || 12;
    const trends = await analyticsService.getFinancialTrends(req.tenantId!, months);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trends = await analyticsService.getEventTrends(req.tenantId!, days);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};