import { singleton, inject } from 'tsyringe';
import mongoose from 'mongoose';
import { ProductionRepository } from '../repositories/ProductionRepository';
import { AuditService } from './audit.service';
import { CreateProductionDTO, PaginationOptions, PaginatedResponse } from '../types';
import { NotFoundError } from '../utils/errors';
import { getPaginationOptions, createPaginatedResponse } from '../utils/pagination.util';

@singleton()
export class ProductionService {
  constructor(
    @inject(ProductionRepository) private productionRepository: ProductionRepository,
    @inject(AuditService) private auditService: AuditService
  ) {}

  async getProductions(
    filters: any,
    options: PaginationOptions
  ): Promise<PaginatedResponse<any>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [productions, total] = await Promise.all([
      this.productionRepository.find(filters, { skip, limit, sort: { date: -1 } }),
      this.productionRepository.count(filters),
    ]);

    return createPaginatedResponse(productions, total, options);
  }

  async getProductionById(id: string, tenantId: string): Promise<any> {
    const production = await this.productionRepository.findOne({ _id: id, tenantId });
    if (!production) {
      throw new NotFoundError('Production record not found');
    }
    return production;
  }

  async createProduction(data: CreateProductionDTO, tenantId: string, userId: string): Promise<any> {
    // Check if production already exists for this date
    const existingProduction = await this.productionRepository.findOne({
      tenantId,
      date: data.date,
    });

    if (existingProduction) {
      throw new NotFoundError('Production record already exists for this date');
    }

    const production = await this.productionRepository.create({
      ...data,
      tenantId: new mongoose.Types.ObjectId(tenantId),
      recordedBy: new mongoose.Types.ObjectId(userId),
    });

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'create',
      'production',
      production._id.toString(),
      undefined,
      data
    );

    return production;
  }

  async updateProduction(id: string, data: Partial<CreateProductionDTO>, tenantId: string, userId: string): Promise<any> {
    const production = await this.getProductionById(id, tenantId);

    const oldValues = { ...production.toObject() };
    const updatedProduction = await this.productionRepository.updateById(id, data);

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'update',
      'production',
      id,
      oldValues,
      data
    );

    return updatedProduction;
  }

  async deleteProduction(id: string, tenantId: string, userId: string): Promise<void> {
    const production = await this.getProductionById(id, tenantId);

    await this.productionRepository.deleteById(id);

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'delete',
      'production',
      id,
      production.toObject()
    );
  }

  async getTotalEggs(tenantId: string, startDate: Date, endDate: Date): Promise<number> {
    return this.productionRepository.getTotalEggs(tenantId, startDate, endDate);
  }

  async getProductionStats(tenantId: string, startDate: Date, endDate: Date): Promise<any> {
    const stats = await this.productionRepository.getProductionStats(tenantId, startDate, endDate);
    return stats[0] || {
      totalEggs: 0,
      avgDailyProduction: 0,
      gradeA: 0,
      gradeB: 0,
      gradeC: 0,
      broken: 0,
      days: 0,
    };
  }

  async getProductionChart(tenantId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const productions = await this.productionRepository.findByDateRange(tenantId, startDate, endDate);
    return productions.map(p => ({
      date: p.date,
      totalEggs: p.totalEggs,
      gradeA: p.gradeBreakdown.gradeA,
      gradeB: p.gradeBreakdown.gradeB,
      gradeC: p.gradeBreakdown.gradeC,
      broken: p.gradeBreakdown.broken,
    }));
  }
}