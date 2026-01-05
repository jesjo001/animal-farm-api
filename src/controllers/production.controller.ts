import { Request, Response, NextFunction } from 'express';
import { ProductionService } from '../services/production.service';
import { container } from 'tsyringe';
import { createProductionSchema } from '../utils/validators';
import { getPaginationOptions } from '../utils/pagination.util';

const productionService = container.resolve(ProductionService);

export const getProductions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = getPaginationOptions(req.query);
    const filters: any = { tenantId: req.tenantId };

    if (req.query.startDate && req.query.endDate) {
      filters.date = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    const result = await productionService.getProductions(filters, options);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const production = await productionService.getProductionById(req.params.id, req.tenantId!);

    res.json({
      success: true,
      data: production,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createProductionSchema.parse(req.body);
    const production = await productionService.createProduction(data, req.tenantId!, req.user!._id.toString());

    res.status(201).json({
      success: true,
      message: 'Production record created successfully',
      data: production,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const production = await productionService.updateProduction(
      req.params.id,
      data,
      req.tenantId!,
      req.user!._id.toString()
    );

    res.json({
      success: true,
      message: 'Production record updated successfully',
      data: production,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productionService.deleteProduction(req.params.id, req.tenantId!, req.user!._id.toString());

    res.json({
      success: true,
      message: 'Production record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getProductionStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

    const stats = await productionService.getProductionStats(req.tenantId!, startDate, endDate);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductionChart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const chart = await productionService.getProductionChart(req.tenantId!, new Date(Date.now() - days * 24 * 60 * 60 * 1000), new Date());

    res.json({
      success: true,
      data: chart,
    });
  } catch (error) {
    next(error);
  }
};