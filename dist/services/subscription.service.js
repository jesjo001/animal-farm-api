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
exports.SubscriptionService = void 0;
const tsyringe_1 = require("tsyringe");
const transaction_service_1 = require("./transaction.service");
const audit_service_1 = require("./audit.service");
let SubscriptionService = class SubscriptionService {
    constructor(transactionService, auditService) {
        this.transactionService = transactionService;
        this.auditService = auditService;
    }
    async createSubscription(subscriptionData) {
        const { plan, amount, tenantId, userId, paymentReference } = subscriptionData;
        // Create subscription transaction
        const transactionData = {
            transactionType: 'income',
            amount,
            date: new Date(),
            category: 'Subscription',
            description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
            paymentMethod: 'flutterwave',
            paymentStatus: 'completed',
            paymentReference,
        };
        const transaction = await this.transactionService.createTransaction(transactionData, tenantId, userId);
        // TODO: Update tenant subscription plan in database
        // This would typically update a subscription field in the tenant model
        // Create audit log
        await this.auditService.logActivity(tenantId, userId, 'create', 'subscription', transaction._id.toString(), undefined, { plan, amount });
        return {
            success: true,
            transaction,
            plan,
        };
    }
    getPlanDetails(plan) {
        const plans = {
            free: { price: 0, name: 'Free Plan' },
            basic: { price: 10, name: 'Basic Plan' },
            pro: { price: 25, name: 'Pro Plan' },
            business: { price: 99, name: 'Business Plan' },
        };
        return plans[plan] || null;
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(transaction_service_1.TransactionService)),
    __param(1, (0, tsyringe_1.inject)(audit_service_1.AuditService)),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        audit_service_1.AuditService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map