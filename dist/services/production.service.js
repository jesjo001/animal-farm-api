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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionService = void 0;
const tsyringe_1 = require("tsyringe");
const mongoose_1 = __importDefault(require("mongoose"));
const ProductionRepository_1 = require("../repositories/ProductionRepository");
const audit_service_1 = require("./audit.service");
const errors_1 = require("../utils/errors");
const pagination_util_1 = require("../utils/pagination.util");
let ProductionService = class ProductionService {
    constructor(productionRepository, auditService) {
        this.productionRepository = productionRepository;
        this.auditService = auditService;
    }
    async getProductions(filters, options) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const [productions, total] = await Promise.all([
            this.productionRepository.find(filters, { skip, limit, sort: { date: -1 } }),
            this.productionRepository.count(filters),
        ]);
        return (0, pagination_util_1.createPaginatedResponse)(productions, total, options);
    }
    async getProductionById(id, tenantId) {
        const production = await this.productionRepository.findOne({ _id: id, tenantId });
        if (!production) {
            throw new errors_1.NotFoundError('Production record not found');
        }
        return production;
    }
    async createProduction(data, tenantId, userId) {
        // Check if production already exists for this date
        const existingProduction = await this.productionRepository.findOne({
            tenantId,
            date: data.date,
        });
        if (existingProduction) {
            throw new errors_1.NotFoundError('Production record already exists for this date');
        }
        const production = await this.productionRepository.create({
            ...data,
            tenantId: new mongoose_1.default.Types.ObjectId(tenantId),
            recordedBy: new mongoose_1.default.Types.ObjectId(userId),
        });
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'create', 'production', production._id.toString(), undefined, data);
        return production;
    }
    async updateProduction(id, data, tenantId, userId) {
        const production = await this.getProductionById(id, tenantId);
        const oldValues = { ...production.toObject() };
        const updatedProduction = await this.productionRepository.updateById(id, data);
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'update', 'production', id, oldValues, data);
        return updatedProduction;
    }
    async deleteProduction(id, tenantId, userId) {
        const production = await this.getProductionById(id, tenantId);
        await this.productionRepository.deleteById(id);
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'delete', 'production', id, production.toObject());
    }
    async getTotalEggs(tenantId, startDate, endDate) {
        return this.productionRepository.getTotalEggs(tenantId, startDate, endDate);
    }
    async getProductionStats(tenantId, startDate, endDate) {
        const stats = await this.productionRepository.getProductionStats(tenantId, startDate, endDate);
        return stats[0] || {
            totalEggs: 0,
            avgDailyProduction: 0,
            gradeA: 0,
            gradeB: 0,
            gradeC: 0,
            broken: 0,
            days: 0,
        };
    }
    async getProductionChart(tenantId, startDate, endDate) {
        const productions = await this.productionRepository.findByDateRange(tenantId, startDate, endDate);
        return productions.map(p => ({
            date: p.date,
            totalEggs: p.totalEggs,
            gradeA: p.gradeBreakdown.gradeA,
            gradeB: p.gradeBreakdown.gradeB,
            gradeC: p.gradeBreakdown.gradeC,
            broken: p.gradeBreakdown.broken,
        }));
    }
};
exports.ProductionService = ProductionService;
exports.ProductionService = ProductionService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(ProductionRepository_1.ProductionRepository)),
    __param(1, (0, tsyringe_1.inject)(audit_service_1.AuditService)),
    __metadata("design:paramtypes", [ProductionRepository_1.ProductionRepository,
        audit_service_1.AuditService])
], ProductionService);
//# sourceMappingURL=production.service.js.map