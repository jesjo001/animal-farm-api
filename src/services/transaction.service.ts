import { singleton, inject } from 'tsyringe';
import mongoose from 'mongoose';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { AuditService } from './audit.service';
import { CreateTransactionDTO, PaginationOptions, PaginatedResponse } from '../types';
import { NotFoundError } from '../utils/errors';
import { getPaginationOptions, createPaginatedResponse } from '../utils/pagination.util';

@singleton()
export class TransactionService {
  constructor(
    @inject(TransactionRepository) private transactionRepository: TransactionRepository,
    @inject(AuditService) private auditService: AuditService
  ) {}

  async getTransactions(
    filters: any,
    options: PaginationOptions
  ): Promise<PaginatedResponse<any>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.transactionRepository.find(filters, { skip, limit, sort: { date: -1 } }),
      this.transactionRepository.count(filters),
    ]);

    return createPaginatedResponse(transactions, total, options);
  }

  async getTransactionById(id: string, tenantId: string): Promise<any> {
    const transaction = await this.transactionRepository.findOne({ _id: id, tenantId });
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }
    return transaction;
  }

  async createTransaction(data: CreateTransactionDTO, tenantId: string, userId: string): Promise<any> {
    const transactionData: any = {
      ...data,
      tenantId: new mongoose.Types.ObjectId(tenantId),
      recordedBy: new mongoose.Types.ObjectId(userId),
    };

    if (data.animalId) {
      transactionData.animalId = new mongoose.Types.ObjectId(data.animalId);
    }

    const transaction = await this.transactionRepository.create(transactionData);

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'create',
      'transaction',
      transaction._id.toString(),
      undefined,
      data
    );

    return transaction;
  }

  async updateTransaction(id: string, data: Partial<CreateTransactionDTO>, tenantId: string, userId: string): Promise<any> {
    const transaction = await this.getTransactionById(id, tenantId);

    const oldValues = { ...transaction.toObject() };
    const updatedTransaction = await this.transactionRepository.updateById(id, data);

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'update',
      'transaction',
      id,
      oldValues,
      data
    );

    return updatedTransaction;
  }

  async deleteTransaction(id: string, tenantId: string, userId: string): Promise<void> {
    const transaction = await this.getTransactionById(id, tenantId);

    await this.transactionRepository.deleteById(id);

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'delete',
      'transaction',
      id,
      transaction.toObject()
    );
  }

  async getTotalIncome(tenantId: string, startDate: Date, endDate: Date): Promise<number> {
    return this.transactionRepository.getTotalIncome(tenantId, startDate, endDate);
  }

  async getTotalExpenses(tenantId: string, startDate: Date, endDate: Date): Promise<number> {
    return this.transactionRepository.getTotalExpenses(tenantId, startDate, endDate);
  }

  async getFinancialSummary(tenantId: string, startDate: Date, endDate: Date): Promise<any> {
    const summary = await this.transactionRepository.getFinancialSummary(tenantId, startDate, endDate);

    const income = summary.find((s: any) => s._id === 'income') || { total: 0 };
    const expenses = summary.find((s: any) => s._id === 'expense') || { total: 0 };

    const netProfit = income.total - expenses.total;

    return {
      totalIncome: income.total,
      totalExpenses: expenses.total,
      netProfit,
      profitMargin: income.total > 0 ? (netProfit / income.total * 100).toFixed(2) : 0,
    };
  }

  async getProfitLossReport(tenantId: string, startDate: Date, endDate: Date): Promise<any> {
    const transactions = await this.transactionRepository.findByDateRange(tenantId, startDate, endDate);

    const report = transactions.reduce((acc, transaction) => {
      const month = transaction.date.toISOString().slice(0, 7); // YYYY-MM

      if (!acc[month]) {
        acc[month] = { income: 0, expenses: 0, netProfit: 0 };
      }

      if (transaction.transactionType === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
      }

      acc[month].netProfit = acc[month].income - acc[month].expenses;

      return acc;
    }, {} as Record<string, { income: number; expenses: number; netProfit: number }>);

    return Object.entries(report).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}