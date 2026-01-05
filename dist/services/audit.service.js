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
exports.AuditService = void 0;
const tsyringe_1 = require("tsyringe");
const BaseRepository_1 = require("../repositories/BaseRepository");
let AuditService = class AuditService {
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async logActivity(tenantId, userId, action, resource, resourceId, oldValues, newValues, ipAddress, userAgent) {
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
    async getAuditLogs(tenantId, filters, page = 1, limit = 50) {
        const query = { tenantId };
        if (filters.userId)
            query.userId = filters.userId;
        if (filters.action)
            query.action = filters.action;
        if (filters.resource)
            query.resource = filters.resource;
        if (filters.startDate || filters.endDate) {
            query.timestamp = {};
            if (filters.startDate)
                query.timestamp.$gte = filters.startDate;
            if (filters.endDate)
                query.timestamp.$lte = filters.endDate;
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
    async getResourceHistory(tenantId, resource, resourceId) {
        return this.auditLogRepository.find({ tenantId, resource, resourceId }, { sort: { timestamp: -1 } });
    }
    async getUserActivity(tenantId, userId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.auditLogRepository.find({ tenantId, userId, timestamp: { $gte: startDate } }, { sort: { timestamp: -1 } });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('AuditLogRepository')),
    __metadata("design:paramtypes", [BaseRepository_1.BaseRepository])
], AuditService);
//# sourceMappingURL=audit.service.js.map