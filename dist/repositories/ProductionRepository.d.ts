import { IProduction } from '../models/Production.model';
import { BaseRepository } from './BaseRepository';
export declare class ProductionRepository extends BaseRepository<IProduction> {
    constructor();
    findByDateRange(tenantId: string, startDate: Date, endDate: Date): Promise<IProduction[]>;
    getTotalEggs(tenantId: string, startDate: Date, endDate: Date): Promise<number>;
    getProductionStats(tenantId: string, startDate: Date, endDate: Date): Promise<any>;
}
//# sourceMappingURL=ProductionRepository.d.ts.map