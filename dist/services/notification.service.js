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
exports.NotificationService = void 0;
const tsyringe_1 = require("tsyringe");
const BaseRepository_1 = require("../repositories/BaseRepository");
let NotificationService = class NotificationService {
    constructor(notificationRepository, userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }
    async createNotification(tenantId, userId, type, title, message, relatedEntity) {
        return this.notificationRepository.create({
            tenantId,
            userId,
            type,
            title,
            message,
            relatedEntity,
        });
    }
    async getUserNotifications(userId, tenantId, limit = 50) {
        return this.notificationRepository.find({ tenantId, userId }, { limit, sort: { createdAt: -1 } });
    }
    async markAsRead(notificationId, userId, tenantId) {
        return this.notificationRepository.updateById(notificationId, { isRead: true });
    }
    async markAllAsRead(userId, tenantId) {
        await this.notificationRepository.updateMany({ tenantId, userId, isRead: false }, { isRead: true });
    }
    async getUnreadCount(userId, tenantId) {
        return this.notificationRepository.count({ tenantId, userId, isRead: false });
    }
    async sendLowFeedStockAlert(tenantId, feedType, currentQuantity) {
        // Get all users in the tenant
        const users = await this.userRepository.find({ tenantId });
        const notifications = users.map(user => this.createNotification(tenantId, user._id.toString(), 'warning', 'Low Feed Stock Alert', `Feed type "${feedType}" is running low. Current quantity: ${currentQuantity}`, { type: 'feed', id: feedType }));
        await Promise.all(notifications);
    }
    async sendMortalityAlert(tenantId, animalId, animalTag) {
        const users = await this.userRepository.find({ tenantId });
        const notifications = users.map(user => this.createNotification(tenantId, user._id.toString(), 'error', 'Animal Mortality', `Animal with tag "${animalTag}" has been marked as deceased.`, { type: 'animal', id: animalId }));
        await Promise.all(notifications);
    }
    async sendProductionMilestoneAlert(tenantId, totalEggs, date) {
        const users = await this.userRepository.find({ tenantId });
        const notifications = users.map(user => this.createNotification(tenantId, user._id.toString(), 'success', 'Production Milestone', `Congratulations! ${totalEggs} eggs were collected on ${date.toDateString()}.`, { type: 'production', id: date.toISOString() }));
        await Promise.all(notifications);
    }
    // Scheduled task methods
    async sendDailyProductionReports() {
        // Implementation for sending daily production reports to all tenants
        // This would typically involve querying all tenants and sending emails
        // For now, just log
        console.log('Sending daily production reports...');
    }
    async checkLowInventoryAlerts() {
        // Implementation for checking low inventory and sending alerts
        console.log('Checking low inventory alerts...');
    }
    async sendWeeklySummaryReports() {
        // Implementation for sending weekly summary reports
        console.log('Sending weekly summary reports...');
    }
    async sendMonthlyFinancialReports() {
        // Implementation for sending monthly financial reports
        console.log('Sending monthly financial reports...');
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('NotificationRepository')),
    __param(1, (0, tsyringe_1.inject)('UserRepository')),
    __metadata("design:paramtypes", [BaseRepository_1.BaseRepository,
        BaseRepository_1.BaseRepository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map