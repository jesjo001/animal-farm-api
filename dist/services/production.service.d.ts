import { ProductionRepository } from '../repositories/ProductionRepository';
import { AuditService } from './audit.service';
import { CreateProductionDTO, PaginationOptions, PaginatedResponse } from '../types';
export declare class ProductionService {
    private productionRepository;
    private auditService;
    constructor(productionRepository: ProductionRepository, auditService: AuditService);
    getProductions(filters: any, options: PaginationOptions): Promise<PaginatedResponse<any>>;
    getProductionById(id: string, tenantId: string): Promise<any>;
    createProduction(data: CreateProductionDTO, tenantId: string, userId: string): Promise<any>;
    updateProduction(id: string, data: Partial<CreateProductionDTO>, tenantId: string, userId: string): Promise<any>;
    deleteProduction(id: string, tenantId: string, userId: string): Promise<void>;
    getTotalEggs(tenantId: string, startDate: Date, endDate: Date): Promise<number>;
    getProductionStats(tenantId: string, startDate: Date, endDate: Date): Promise<any>;
    getProductionChart(tenantId: string, startDate: Date, endDate: Date): Promise<any[]>;
}
//# sourceMappingURL=production.service.d.ts.map