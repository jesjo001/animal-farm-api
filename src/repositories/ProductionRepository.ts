import { singleton } from 'tsyringe';
import Production, { IProduction } from '../models/Production.model';
import { BaseRepository } from './BaseRepository';

@singleton()
export class ProductionRepository extends BaseRepository<IProduction> {
  constructor() {
    super(Production);
  }

  async findByDateRange(tenantId: string, startDate: Date, endDate: Date): Promise<IProduction[]> {
    return this.find({
      tenantId,
      date: { $gte: startDate, $lte: endDate },
    });
  }

  async getTotalEggs(tenantId: string, startDate: Date, endDate: Date): Promise<number> {
    const result = await this.model.aggregate([
      {
        $match: {
          tenantId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalEggs' },
        },
      },
    ]);

    return result[0]?.total || 0;
  }

  async getProductionStats(tenantId: string, startDate: Date, endDate: Date): Promise<any> {
    return this.model.aggregate([
      {
        $match: {
          tenantId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalEggs: { $sum: '$totalEggs' },
          avgDailyProduction: { $avg: '$totalEggs' },
          gradeA: { $sum: '$gradeBreakdown.gradeA' },
          gradeB: { $sum: '$gradeBreakdown.gradeB' },
          gradeC: { $sum: '$gradeBreakdown.gradeC' },
          broken: { $sum: '$gradeBreakdown.broken' },
          days: { $sum: 1 },
        },
      },
    ]);
  }
}