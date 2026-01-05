import { singleton, inject } from 'tsyringe';
import { BaseRepository } from '../repositories/BaseRepository';

@singleton()
export class AuditService {
  constructor(
    @inject('AuditLogRepository') private auditLogRepository: BaseRepository<any>
  ) {}

  async logActivity(
    tenantId: string,
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    oldValues?: any,
    newValues?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<any> {
    return this.auditLogRepository.create({
      tenantId,
      userId,
      action,
      resource,
      resourceId,
      oldValues,
      newValues,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  }

  async getAuditLogs(
    tenantId: string,
    filters: {
      userId?: string;
      action?: string;
      resource?: string;
      startDate?: Date;
      endDate?: Date;
    },
    page: number = 1,
    limit: number = 50
  ): Promise<any> {
    const query: any = { tenantId };

    if (filters.userId) query.userId = filters.userId;
    if (filters.action) query.action = filters.action;
    if (filters.resource) query.resource = filters.resource;
    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = filters.startDate;
      if (filters.endDate) query.timestamp.$lte = filters.endDate;
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.auditLogRepository.find(query, {
        skip,
        limit,
        sort: { timestamp: -1 },
        populate: ['userId']
      }),
      this.auditLogRepository.count(query),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getResourceHistory(tenantId: string, resource: string, resourceId: string): Promise<any[]> {
    return this.auditLogRepository.find(
      { tenantId, resource, resourceId },
      { sort: { timestamp: -1 } }
    );
  }

  async getUserActivity(tenantId: string, userId: string, days: number = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.auditLogRepository.find(
      { tenantId, userId, timestamp: { $gte: startDate } },
      { sort: { timestamp: -1 } }
    );
  }
}