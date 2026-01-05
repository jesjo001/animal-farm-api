import { BaseRepository } from '../repositories/BaseRepository';
import { AuditService } from './audit.service';
import { CreateEventDTO, PaginationOptions, PaginatedResponse } from '../types';
export declare class EventService {
    private eventRepository;
    private auditService;
    constructor(eventRepository: BaseRepository<any>, auditService: AuditService);
    getEvents(filters: any, options: PaginationOptions): Promise<PaginatedResponse<any>>;
    getEventById(id: string, tenantId: string): Promise<any>;
    createEvent(data: CreateEventDTO, tenantId: string, userId: string): Promise<any>;
    updateEvent(id: string, data: Partial<CreateEventDTO>, tenantId: string, userId: string): Promise<any>;
    deleteEvent(id: string, tenantId: string, userId: string): Promise<void>;
    getMortalityRate(tenantId: string, period: 'daily' | 'weekly' | 'monthly'): Promise<any>;
    getEventStats(tenantId: string, startDate: Date, endDate: Date): Promise<any>;
    getTimeline(tenantId: string, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=event.service.d.ts.map