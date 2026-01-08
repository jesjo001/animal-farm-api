import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { container } from 'tsyringe';

const analyticsService = container.resolve(AnalyticsService);

export const getFinancialSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { period = '6months' } = req.query;
        let startDate: Date;
        const endDate = new Date();

        switch (period) {
            case '1month':
                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
                break;
            case '3months':
                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, endDate.getDate());
                break;
            case '1year':
                startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
                break;
            case '6months':
            default:
                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 6, endDate.getDate());
                break;
        }

        const summary = await analyticsService.getFinancialSummary(req.tenantId!, startDate, endDate);
        res.json({ success: true, data: summary });
    } catch (error) {
        next(error);
    }
};

export const getComprehensiveAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { period = '30days' } = req.query;
        let days: number;

        switch (period) {
            case '7days':
                days = 7;
                break;
            case '90days':
                days = 90;
                break;
            case '1year':
                days = 365;
                break;
            case '30days':
            default:
                days = 30;
                break;
        }

        const analytics = await analyticsService.getComprehensiveAnalytics(req.tenantId!, days);
        res.json({ success: true, data: analytics });
    } catch (error) {
        next(error);
    }
};

