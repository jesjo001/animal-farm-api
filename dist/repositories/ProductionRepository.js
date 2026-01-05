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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionRepository = void 0;
const tsyringe_1 = require("tsyringe");
const Production_model_1 = __importDefault(require("../models/Production.model"));
const BaseRepository_1 = require("./BaseRepository");
let ProductionRepository = class ProductionRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Production_model_1.default);
    }
    async findByDateRange(tenantId, startDate, endDate) {
        return this.find({
            tenantId,
            date: { $gte: startDate, $lte: endDate },
        });
    }
    async getTotalEggs(tenantId, startDate, endDate) {
        const result = await this.model.aggregate([
            {
                $match: {
                    tenantId,
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalEggs' },
                },
            },
        ]);
        return result[0]?.total || 0;
    }
    async getProductionStats(tenantId, startDate, endDate) {
        return this.model.aggregate([
            {
                $match: {
                    tenantId,
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    totalEggs: { $sum: '$totalEggs' },
                    avgDailyProduction: { $avg: '$totalEggs' },
                    gradeA: { $sum: '$gradeBreakdown.gradeA' },
                    gradeB: { $sum: '$gradeBreakdown.gradeB' },
                    gradeC: { $sum: '$gradeBreakdown.gradeC' },
                    broken: { $sum: '$gradeBreakdown.broken' },
                    days: { $sum: 1 },
                },
            },
        ]);
    }
};
exports.ProductionRepository = ProductionRepository;
exports.ProductionRepository = ProductionRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [])
], ProductionRepository);
//# sourceMappingURL=ProductionRepository.js.map