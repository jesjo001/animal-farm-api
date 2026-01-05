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
exports.ReportService = void 0;
const tsyringe_1 = require("tsyringe");
const transaction_service_1 = require("./transaction.service");
const production_service_1 = require("./production.service");
let ReportService = class ReportService {
    constructor(transactionService, productionService) {
        this.transactionService = transactionService;
        this.productionService = productionService;
    }
    async generateProfitLossReport(tenantId, startDate, endDate) {
        // Implementation for P&L report
        return {};
    }
    async generateCashFlowReport(tenantId, startDate, endDate) {
        // Implementation for cash flow report
        return {};
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(transaction_service_1.TransactionService)),
    __param(1, (0, tsyringe_1.inject)(production_service_1.ProductionService)),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        production_service_1.ProductionService])
], ReportService);
//# sourceMappingURL=report.service.js.map