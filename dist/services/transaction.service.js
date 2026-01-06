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
exports.TransactionService = void 0;
const tsyringe_1 = require("tsyringe");
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionRepository_1 = require("../repositories/TransactionRepository");
const audit_service_1 = require("./audit.service");
const errors_1 = require("../utils/errors");
const pagination_util_1 = require("../utils/pagination.util");
let TransactionService = class TransactionService {
    constructor(transactionRepository, auditService) {
        this.transactionRepository = transactionRepository;
        this.auditService = auditService;
    }
    async getTransactions(filters, options) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            this.transactionRepository.find(filters, { skip, limit, sort: { date: -1 } }),
            this.transactionRepository.count(filters),
        ]);
        return (0, pagination_util_1.createPaginatedResponse)(transactions, total, options);
    }
    async getTransactionById(id, tenantId) {
        const transaction = await this.transactionRepository.findOne({ _id: id, tenantId });
        if (!transaction) {
            throw new errors_1.NotFoundError('Transaction not found');
        }
        return transaction;
    }
    async createTransaction(data, tenantId, userId) {
        const transactionData = {
            ...data,
            tenantId: new mongoose_1.default.Types.ObjectId(tenantId),
            recordedBy: new mongoose_1.default.Types.ObjectId(userId),
        };
        if (data.animalId) {
            transactionData.animalId = new mongoose_1.default.Types.ObjectId(data.animalId);
        }
        const transaction = await this.transactionRepository.create(transactionData);
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'create', 'transaction', transaction._id.toString(), undefined, data);
        return transaction;
    }
    async updateTransaction(id, data, tenantId, userId) {
        const transaction = await this.getTransactionById(id, tenantId);
        const oldValues = { ...transaction.toObject() };
        const updatedTransaction = await this.transactionRepository.updateById(id, data);
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'update', 'transaction', id, oldValues, data);
        return updatedTransaction;
    }
    async deleteTransaction(id, tenantId, userId) {
        const transaction = await this.getTransactionById(id, tenantId);
        await this.transactionRepository.deleteById(id);
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'delete', 'transaction', id, transaction.toObject());
    }
    async getTotalIncome(tenantId, startDate, endDate) {
        return this.transactionRepository.getTotalIncome(tenantId, startDate, endDate);
    }
    async getTotalExpenses(tenantId, startDate, endDate) {
        return this.transactionRepository.getTotalExpenses(tenantId, startDate, endDate);
    }
    async getFinancialSummary(tenantId, startDate, endDate) {
        console.log('getFinancialSummary service called with:', { tenantId, startDate, endDate });
        const summary = await this.transactionRepository.getFinancialSummary(tenantId, startDate, endDate);
        console.log('Raw summary from repository:', summary);
        const income = summary.find((s) => s._id === 'income') || { total: 0 };
        const expenses = summary.find((s) => s._id === 'expense') || { total: 0 };
        console.log('Parsed income and expenses:', { income, expenses });
        const netProfit = income.total - expenses.total;
        const result = {
            totalIncome: income.total,
            totalExpenses: expenses.total,
            netProfit,
            profitMargin: income.total > 0 ? (netProfit / income.total * 100).toFixed(2) : 0,
        };
        console.log('Final result:', result);
        return result;
    }
    async getProfitLossReport(tenantId, startDate, endDate) {
        const transactions = await this.transactionRepository.findByDateRange(tenantId, startDate, endDate);
        const report = transactions.reduce((acc, transaction) => {
            const month = transaction.date.toISOString().slice(0, 7); // YYYY-MM
            if (!acc[month]) {
                acc[month] = { income: 0, expenses: 0, netProfit: 0 };
            }
            if (transaction.transactionType === 'income') {
                acc[month].income += transaction.amount;
            }
            else {
                acc[month].expenses += transaction.amount;
            }
            acc[month].netProfit = acc[month].income - acc[month].expenses;
            return acc;
        }, {});
        return Object.entries(report).map(([month, data]) => ({
            month,
            ...data,
        }));
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(TransactionRepository_1.TransactionRepository)),
    __param(1, (0, tsyringe_1.inject)(audit_service_1.AuditService)),
    __metadata("design:paramtypes", [TransactionRepository_1.TransactionRepository,
        audit_service_1.AuditService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map