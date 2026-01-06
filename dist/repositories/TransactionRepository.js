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
exports.TransactionRepository = void 0;
const tsyringe_1 = require("tsyringe");
const mongoose_1 = __importDefault(require("mongoose"));
const Transaction_model_1 = __importDefault(require("../models/Transaction.model"));
const BaseRepository_1 = require("./BaseRepository");
let TransactionRepository = class TransactionRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Transaction_model_1.default);
    }
    async findByType(tenantId, transactionType) {
        return this.find({ tenantId, transactionType });
    }
    async findByDateRange(tenantId, startDate, endDate) {
        return this.find({
            tenantId,
            date: { $gte: startDate, $lte: endDate },
        });
    }
    async getTotalIncome(tenantId, startDate, endDate) {
        const result = await this.model.aggregate([
            {
                $match: {
                    tenantId: new mongoose_1.default.Types.ObjectId(tenantId),
                    transactionType: 'income',
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                },
            },
        ]);
        return result[0]?.total || 0;
    }
    async getTotalExpenses(tenantId, startDate, endDate) {
        const result = await this.model.aggregate([
            {
                $match: {
                    tenantId: new mongoose_1.default.Types.ObjectId(tenantId),
                    transactionType: 'expense',
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                },
            },
        ]);
        return result[0]?.total || 0;
    }
    async getFinancialSummary(tenantId, startDate, endDate) {
        console.log('getFinancialSummary repository called with:', { tenantId, startDate, endDate });
        const result = await this.model.aggregate([
            {
                $match: {
                    tenantId: new mongoose_1.default.Types.ObjectId(tenantId),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: '$transactionType',
                    total: { $sum: '$amount' },
                    transactions: { $push: '$$ROOT' },
                },
            },
        ]);
        console.log('Aggregation result:', result);
        return result;
    }
};
exports.TransactionRepository = TransactionRepository;
exports.TransactionRepository = TransactionRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [])
], TransactionRepository);
//# sourceMappingURL=TransactionRepository.js.map