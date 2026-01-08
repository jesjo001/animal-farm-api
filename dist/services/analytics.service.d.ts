import { AnimalService } from './animal.service';
import { ProductionService } from './production.service';
import { EventService } from './event.service';
import { TransactionService } from './transaction.service';
export declare class AnalyticsService {
    private animalService;
    private productionService;
    private eventService;
    private transactionService;
    constructor(animalService: AnimalService, productionService: ProductionService, eventService: EventService, transactionService: TransactionService);
    getKPIs(tenantId: string): Promise<any>;
    getProductionTrends(tenantId: string, days?: number): Promise<any[]>;
    getFinancialTrends(tenantId: string, startDate: Date, endDate: Date): Promise<any[]>;
    getFinancialSummary(tenantId: string, startDate: Date, endDate: Date): Promise<any>;
    getComprehensiveAnalytics(tenantId: string, days: number): Promise<any>;
    getEventTrends(tenantId: string, days?: number): Promise<any>;
    getDashboardData(tenantId: string): Promise<any>;
    generateDailyAnalytics(): Promise<void>;
    generateWeeklyAnalytics(): Promise<void>;
    generateMonthlyAnalytics(): Promise<void>;
}
//# sourceMappingURL=analytics.service.d.ts.map