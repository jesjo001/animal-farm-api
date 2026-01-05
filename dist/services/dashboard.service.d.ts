import { AnimalService } from './animal.service';
import { ProductionService } from './production.service';
import { TransactionService } from './transaction.service';
import { EventService } from './event.service';
export declare class DashboardService {
    private animalService;
    private productionService;
    private transactionService;
    private eventService;
    constructor(animalService: AnimalService, productionService: ProductionService, transactionService: TransactionService, eventService: EventService);
    getDashboardStats(tenantId: string): Promise<{
        totalAnimals: number;
    }>;
    getRecentActivity(tenantId: string): Promise<never[]>;
}
//# sourceMappingURL=dashboard.service.d.ts.map