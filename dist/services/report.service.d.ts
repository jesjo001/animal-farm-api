import { TransactionService } from './transaction.service';
import { ProductionService } from './production.service';
export declare class ReportService {
    private transactionService;
    private productionService;
    constructor(transactionService: TransactionService, productionService: ProductionService);
    generateProfitLossReport(tenantId: string, startDate: Date, endDate: Date): Promise<{}>;
    generateCashFlowReport(tenantId: string, startDate: Date, endDate: Date): Promise<{}>;
}
//# sourceMappingURL=report.service.d.ts.map