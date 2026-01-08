import { BaseRepository } from '../repositories/BaseRepository';
export declare class TenantService {
    private tenantRepository;
    constructor(tenantRepository: BaseRepository<any>);
    createTenant(data: any): Promise<any>;
    getTenantById(id: string): Promise<any>;
    updateTenant(id: string, data: any): Promise<any>;
    updateSubscriptionPlan(id: string, plan: string): Promise<any>;
}
//# sourceMappingURL=tenant.service.d.ts.map