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
exports.DashboardService = void 0;
const tsyringe_1 = require("tsyringe");
const animal_service_1 = require("./animal.service");
const production_service_1 = require("./production.service");
const transaction_service_1 = require("./transaction.service");
const event_service_1 = require("./event.service");
let DashboardService = class DashboardService {
    constructor(animalService, productionService, transactionService, eventService) {
        this.animalService = animalService;
        this.productionService = productionService;
        this.transactionService = transactionService;
        this.eventService = eventService;
    }
    async getDashboardStats(tenantId) {
        // Implementation for dashboard stats
        const totalAnimals = await this.animalService.getAnimals({ tenantId, isActive: true }, { page: 1, limit: 1 });
        // Add more stats calculations
        return {
            totalAnimals: totalAnimals.pagination.total,
            // other stats
        };
    }
    async getRecentActivity(tenantId) {
        // Implementation for recent activity
        return [];
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(animal_service_1.AnimalService)),
    __param(1, (0, tsyringe_1.inject)(production_service_1.ProductionService)),
    __param(2, (0, tsyringe_1.inject)(transaction_service_1.TransactionService)),
    __param(3, (0, tsyringe_1.inject)(event_service_1.EventService)),
    __metadata("design:paramtypes", [animal_service_1.AnimalService,
        production_service_1.ProductionService,
        transaction_service_1.TransactionService,
        event_service_1.EventService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map