import { ITransaction } from '../models/Transaction.model';
import { BaseRepository } from './BaseRepository';
export declare class TransactionRepository extends BaseRepository<ITransaction> {
    constructor();
    findByType(tenantId: string, transactionType: 'income' | 'expense'): Promise<ITransaction[]>;
    findByDateRange(tenantId: string, startDate: Date, endDate: Date): Promise<ITransaction[]>;
    getTotalIncome(tenantId: string, startDate: Date, endDate: Date): Promise<number>;
    getTotalExpenses(tenantId: string, startDate: Date, endDate: Date): Promise<number>;
    getFinancialSummary(tenantId: string, startDate: Date, endDate: Date): Promise<any>;
}
//# sourceMappingURL=TransactionRepository.d.ts.map