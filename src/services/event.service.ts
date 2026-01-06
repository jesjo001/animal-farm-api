import { singleton, inject } from 'tsyringe';
import { BaseRepository } from '../repositories/BaseRepository';
import { AuditService } from './audit.service';
import { CreateEventDTO, PaginationOptions, PaginatedResponse } from '../types';
import { NotFoundError } from '../utils/errors';
import { getPaginationOptions, createPaginatedResponse } from '../utils/pagination.util';

@singleton()
export class EventService {
  constructor(
    @inject('EventRepository') private eventRepository: BaseRepository<any>,
    @inject(AuditService) private auditService: AuditService
  ) {}

  async getEvents(
    filters: any,
    options: PaginationOptions
  ): Promise<PaginatedResponse<any>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.eventRepository.find(filters, { skip, limit, sort: { date: -1 }, populate: 'animalId' }),
      this.eventRepository.count(filters),
    ]);

    return createPaginatedResponse(events, total, options);
  }

  async getEventById(id: string, tenantId: string): Promise<any> {
    const event = await this.eventRepository.findOne({ _id: id, tenantId });
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    return event;
  }

  async createEvent(data: CreateEventDTO, tenantId: string, userId: string): Promise<any> {
    const event = await this.eventRepository.create({
      ...data,
      tenantId,
      recordedBy: userId,
    });

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'create',
      'event',
      event._id.toString(),
      undefined,
      data
    );

    return event;
  }

  async updateEvent(id: string, data: Partial<CreateEventDTO>, tenantId: string, userId: string): Promise<any> {
    const event = await this.getEventById(id, tenantId);

    const oldValues = { ...event.toObject() };
    const updatedEvent = await this.eventRepository.updateById(id, data);

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'update',
      'event',
      id,
      oldValues,
      data
    );

    return updatedEvent;
  }

  async deleteEvent(id: string, tenantId: string, userId: string): Promise<void> {
    const event = await this.getEventById(id, tenantId);

    await this.eventRepository.deleteById(id);

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'delete',
      'event',
      id,
      event.toObject()
    );
  }

  async getMortalityRate(tenantId: string, period: 'daily' | 'weekly' | 'monthly'): Promise<any> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'monthly':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
    }

    const [totalAnimals, deaths] = await Promise.all([
      this.eventRepository.count({ tenantId, eventType: 'death', date: { $gte: startDate } }),
      this.eventRepository.aggregate([
        {
          $match: {
            tenantId,
            eventType: 'death',
            date: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            totalDeaths: { $sum: '$count' },
          },
        },
      ]),
    ]);

    const mortalityRate = totalAnimals > 0 ? (deaths[0]?.totalDeaths || 0) / totalAnimals * 100 : 0;

    return {
      mortalityRate: mortalityRate.toFixed(2),
      totalDeaths: deaths[0]?.totalDeaths || 0,
      period,
    };
  }

  async getEventStats(tenantId: string, startDate: Date, endDate: Date): Promise<any> {
    const stats = await this.eventRepository.aggregate([
      {
        $match: {
          tenantId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: '$count' },
          totalCost: { $sum: '$cost' },
        },
      },
    ]);

    return stats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        totalCost: stat.totalCost,
      };
      return acc;
    }, {});
  }

  async getTimeline(tenantId: string, limit: number = 50): Promise<any[]> {
    return this.eventRepository.find(
      { tenantId },
      { limit, sort: { date: -1 }, populate: ['animalId', 'recordedBy'] }
    );
  }
}