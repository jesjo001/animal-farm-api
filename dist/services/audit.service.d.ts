import { BaseRepository } from '../repositories/BaseRepository';
export declare class AuditService {
    private auditLogRepository;
    constructor(auditLogRepository: BaseRepository<any>);
    logActivity(tenantId: string, userId: string, action: string, resource: string, resourceId?: string, oldValues?: any, newValues?: any, ipAddress?: string, userAgent?: string): Promise<any>;
    getAuditLogs(tenantId: string, filters: {
        userId?: string;
        action?: string;
        resource?: string;
        startDate?: Date;
        endDate?: Date;
    }, page?: number, limit?: number): Promise<any>;
    getResourceHistory(tenantId: string, resource: string, resourceId: string): Promise<any[]>;
    getUserActivity(tenantId: string, userId: string, days?: number): Promise<any[]>;
}
//# sourceMappingURL=audit.service.d.ts.map