import { TransactionRepository } from '../repositories/TransactionRepository';
import { AuditService } from './audit.service';
import { CreateTransactionDTO, PaginationOptions, PaginatedResponse } from '../types';
export declare class TransactionService {
    private transactionRepository;
    private auditService;
    constructor(transactionRepository: TransactionRepository, auditService: AuditService);
    getTransactions(filters: any, options: PaginationOptions): Promise<PaginatedResponse<any>>;
    getTransactionById(id: string, tenantId: string): Promise<any>;
    createTransaction(data: CreateTransactionDTO, tenantId: string, userId: string): Promise<any>;
    updateTransaction(id: string, data: Partial<CreateTransactionDTO>, tenantId: string, userId: string): Promise<any>;
    deleteTransaction(id: string, tenantId: string, userId: string): Promise<void>;
    getTotalIncome(tenantId: string, startDate: Date, endDate: Date): Promise<number>;
    getTotalExpenses(tenantId: string, startDate: Date, endDate: Date): Promise<number>;
    getFinancialSummary(tenantId: string, startDate: Date, endDate: Date): Promise<any>;
    getProfitLossReport(tenantId: string, startDate: Date, endDate: Date): Promise<any>;
}
//# sourceMappingURL=transaction.service.d.ts.map