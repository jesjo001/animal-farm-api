import { singleton } from 'tsyringe';
import Transaction, { ITransaction } from '../models/Transaction.model';
import { BaseRepository } from './BaseRepository';

@singleton()
export class TransactionRepository extends BaseRepository<ITransaction> {
  constructor() {
    super(Transaction);
  }

  async findByType(tenantId: string, transactionType: 'income' | 'expense'): Promise<ITransaction[]> {
    return this.find({ tenantId, transactionType });
  }

  async findByDateRange(tenantId: string, startDate: Date, endDate: Date): Promise<ITransaction[]> {
    return this.find({
      tenantId,
      date: { $gte: startDate, $lte: endDate },
    });
  }

  async getTotalIncome(tenantId: string, startDate: Date, endDate: Date): Promise<number> {
    const result = await this.model.aggregate([
      {
        $match: {
          tenantId,
          transactionType: 'income',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return result[0]?.total || 0;
  }

  async getTotalExpenses(tenantId: string, startDate: Date, endDate: Date): Promise<number> {
    const result = await this.model.aggregate([
      {
        $match: {
          tenantId,
          transactionType: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return result[0]?.total || 0;
  }

  async getFinancialSummary(tenantId: string, startDate: Date, endDate: Date): Promise<any> {
    console.log('getFinancialSummary repository called with:', { tenantId, startDate, endDate });
    
    const result = await this.model.aggregate([
      {
        $match: {
          tenantId: tenantId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$transactionType',
          total: { $sum: '$amount' },
          transactions: { $push: '$$ROOT' },
        },
      },
    ]);
    
    console.log('Aggregation result:', result);
    return result;
  }
}