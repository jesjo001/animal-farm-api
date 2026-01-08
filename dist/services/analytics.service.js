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
exports.AnalyticsService = void 0;
const tsyringe_1 = require("tsyringe");
const animal_service_1 = require("./animal.service");
const production_service_1 = require("./production.service");
const event_service_1 = require("./event.service");
const transaction_service_1 = require("./transaction.service");
let AnalyticsService = class AnalyticsService {
    constructor(animalService, productionService, eventService, transactionService) {
        this.animalService = animalService;
        this.productionService = productionService;
        this.eventService = eventService;
        this.transactionService = transactionService;
    }
    async getKPIs(tenantId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const [animalStats, currentMonthProduction, lastMonthProduction, currentMonthRevenue, lastMonthRevenue, mortalityRate, currentYearRevenue, currentYearExpenses,] = await Promise.all([
            this.animalService.getAnimalStats(tenantId),
            this.productionService.getTotalEggs(tenantId, startOfMonth, now),
            this.productionService.getTotalEggs(tenantId, new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() - 1, 1), startOfMonth),
            this.transactionService.getTotalIncome(tenantId, startOfMonth, now),
            this.transactionService.getTotalIncome(tenantId, new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() - 1, 1), startOfMonth),
            this.eventService.getMortalityRate(tenantId, 'monthly'),
            this.transactionService.getTotalIncome(tenantId, startOfYear, now),
            this.transactionService.getTotalExpenses(tenantId, startOfYear, now),
        ]);
        const revenueGrowth = lastMonthRevenue > 0
            ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
            : 0;
        const productionGrowth = lastMonthProduction > 0
            ? ((currentMonthProduction - lastMonthProduction) / lastMonthProduction * 100)
            : 0;
        return {
            totalAnimals: animalStats.total,
            healthyAnimals: animalStats.healthy,
            sickAnimals: animalStats.sick,
            animalHealthRate: animalStats.healthyPercentage,
            monthlyEggProduction: {
                current: currentMonthProduction,
                growth: productionGrowth.toFixed(2),
            },
            monthlyRevenue: {
                current: currentMonthRevenue,
                growth: revenueGrowth.toFixed(2),
            },
            mortalityRate: mortalityRate.mortalityRate,
            yearlyProfit: currentYearRevenue - currentYearExpenses,
        };
    }
    async getProductionTrends(tenantId, days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.productionService.getProductionChart(tenantId, startDate, endDate);
    }
    async getFinancialTrends(tenantId, startDate, endDate) {
        return this.transactionService.getProfitLossReport(tenantId, startDate, endDate);
    }
    async getFinancialSummary(tenantId, startDate, endDate) {
        const [summary, trends] = await Promise.all([
            this.transactionService.getFinancialSummary(tenantId, startDate, endDate),
            this.getFinancialTrends(tenantId, startDate, endDate)
        ]);
        return {
            summary,
            trends
        };
    }
    async getComprehensiveAnalytics(tenantId, days) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        const prevEndDate = new Date(startDate);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        const prevStartDate = new Date(prevEndDate);
        prevStartDate.setDate(prevStartDate.getDate() - days);
        const [
        // Current period data
        revenue, expenses, eggCount, newAnimals, animalStats, mortalityRate, 
        // Previous period data
        prevRevenue, prevExpenses, prevEggCount, prevNewAnimals, 
        // Chart data
        productionTrends, financialTrends, revenueDistribution,] = await Promise.all([
            this.transactionService.getTotalIncome(tenantId, startDate, endDate),
            this.transactionService.getTotalExpenses(tenantId, startDate, endDate),
            this.productionService.getTotalEggs(tenantId, startDate, endDate),
            this.animalService.count({ tenantId, createdAt: { $gte: startDate, $lte: endDate } }),
            this.animalService.getAnimalStats(tenantId),
            this.eventService.getMortalityRate(tenantId, 'monthly'), // Assuming monthly is ok for this KPI
            this.transactionService.getTotalIncome(tenantId, prevStartDate, prevEndDate),
            this.transactionService.getTotalExpenses(tenantId, prevStartDate, prevEndDate),
            this.productionService.getTotalEggs(tenantId, prevStartDate, prevEndDate),
            this.animalService.count({ tenantId, createdAt: { $gte: prevStartDate, $lte: prevEndDate } }),
            this.getProductionTrends(tenantId, days),
            this.getFinancialTrends(tenantId, startDate, endDate),
            this.transactionService.getFinancialSummary(tenantId, startDate, endDate),
        ]);
        // Calculate KPIs
        const productionEfficiency = (animalStats.total > 0 && days > 0) ? (eggCount / (animalStats.total * days)) * 100 : 0;
        const revenuePerAnimal = animalStats.total > 0 ? revenue / animalStats.total : 0;
        // Assemble response
        return {
            kpis: {
                productionEfficiency,
                revenuePerAnimal,
                mortalityRate: mortalityRate.mortalityRate,
                feedConversion: 1.85, // Placeholder
            },
            productionTrends,
            financialTrends,
            revenueDistribution: revenueDistribution.summary,
            comparison: {
                thisMonth: {
                    revenue,
                    expenses,
                    newAnimals,
                    eggsCollected: eggCount
                },
                lastMonth: {
                    revenue: prevRevenue,
                    expenses: prevExpenses,
                    newAnimals: prevNewAnimals,
                    eggsCollected: prevEggCount
                }
            }
        };
    }
    async getEventTrends(tenantId, days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.eventService.getEventStats(tenantId, startDate, endDate);
    }
    async getDashboardData(tenantId) {
        const [kpis, recentProduction, recentTransactions, recentEvents] = await Promise.all([
            this.getKPIs(tenantId),
            this.productionService.getProductions({ tenantId }, { page: 1, limit: 5 }),
            this.transactionService.getTransactions({ tenantId }, { page: 1, limit: 5 }),
            this.eventService.getEvents({ tenantId }, { page: 1, limit: 5 }),
        ]);
        const mapId = (item) => ({ ...item.toObject(), id: item._id.toString() });
        return {
            kpis,
            recentActivity: {
                production: recentProduction.data.map(mapId),
                transactions: recentTransactions.data.map(mapId),
                events: recentEvents.data.map(mapId),
            },
        };
    }
    // Scheduled task methods
    async generateDailyAnalytics() {
        // Implementation for generating daily analytics reports
        console.log('Generating daily analytics...');
    }
    async generateWeeklyAnalytics() {
        // Implementation for generating weekly analytics reports
        console.log('Generating weekly analytics...');
    }
    async generateMonthlyAnalytics() {
        // Implementation for generating monthly analytics reports
        console.log('Generating monthly analytics...');
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(animal_service_1.AnimalService)),
    __param(1, (0, tsyringe_1.inject)(production_service_1.ProductionService)),
    __param(2, (0, tsyringe_1.inject)(event_service_1.EventService)),
    __param(3, (0, tsyringe_1.inject)(transaction_service_1.TransactionService)),
    __metadata("design:paramtypes", [animal_service_1.AnimalService,
        production_service_1.ProductionService,
        event_service_1.EventService,
        transaction_service_1.TransactionService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map