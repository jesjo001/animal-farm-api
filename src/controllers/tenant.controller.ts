import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../services/tenant.service';
import { container } from 'tsyringe';

const tenantService = container.resolve(TenantService);

export const createTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await tenantService.createTenant(req.body);
    res.status(201).json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const getTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);
    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const getTenantProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await tenantService.getTenantById(req.tenantId!);
    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const updateTenantProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await tenantService.updateTenant(req.tenantId!, req.body);
    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};
