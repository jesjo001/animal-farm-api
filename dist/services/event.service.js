"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const tsyringe_1 = require("tsyringe");
const BaseRepository_1 = require("../repositories/BaseRepository");
const audit_service_1 = require("./audit.service");
const errors_1 = require("../utils/errors");
const pagination_util_1 = require("../utils/pagination.util");
let EventService = class EventService {
    constructor(eventRepository, auditService) {
        this.eventRepository = eventRepository;
        this.auditService = auditService;
    }
    async getEvents(filters, options) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const [events, total] = await Promise.all([
            this.eventRepository.find(filters, { skip, limit, sort: { date: -1 } }),
            this.eventRepository.count(filters),
        ]);
        return (0, pagination_util_1.createPaginatedResponse)(events, total, options);
    }
    async getEventById(id, tenantId) {
        const event = await this.eventRepository.findOne({ _id: id, tenantId });
        if (!event) {
            throw new errors_1.NotFoundError('Event not found');
        }
        return event;
    }
    async createEvent(data, tenantId, userId) {
        const event = await this.eventRepository.create({
            ...data,
            tenantId,
            recordedBy: userId,
        });
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'create', 'event', event._id.toString(), undefined, data);
        return event;
    }
    async updateEvent(id, data, tenantId, userId) {
        const event = await this.getEventById(id, tenantId);
        const oldValues = { ...event.toObject() };
        const updatedEvent = await this.eventRepository.updateById(id, data);
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'update', 'event', id, oldValues, data);
        return updatedEvent;
    }
    async deleteEvent(id, tenantId, userId) {
        const event = await this.getEventById(id, tenantId);
        await this.eventRepository.deleteById(id);
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'delete', 'event', id, event.toObject());
    }
    async getMortalityRate(tenantId, period) {
        const now = new Date();
        let startDate;
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
    async getEventStats(tenantId, startDate, endDate) {
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
    async getTimeline(tenantId, limit = 50) {
        return this.eventRepository.find({ tenantId }, { limit, sort: { date: -1 }, populate: ['animalId', 'recordedBy'] });
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('EventRepository')),
    __param(1, (0, tsyringe_1.inject)(audit_service_1.AuditService)),
    __metadata("design:paramtypes", [BaseRepository_1.BaseRepository,
        audit_service_1.AuditService])
], EventService);
//# sourceMappingURL=event.service.js.map