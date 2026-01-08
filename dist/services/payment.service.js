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
exports.PaymentService = void 0;
const tsyringe_1 = require("tsyringe");
const flutterwave_node_v3_1 = __importDefault(require("flutterwave-node-v3"));
const transaction_service_1 = require("./transaction.service");
const env_1 = require("../config/env");
let PaymentService = class PaymentService {
    constructor(transactionService) {
        this.transactionService = transactionService;
        this.flutterwave = new flutterwave_node_v3_1.default(env_1.env.FLUTTERWAVE_PUBLIC_KEY, env_1.env.FLUTTERWAVE_SECRET_KEY);
    }
    async initiatePayment(paymentData) {
        try {
            const payload = {
                tx_ref: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                amount: paymentData.amount,
                currency: paymentData.currency || 'NGN',
                redirect_url: paymentData.redirectUrl || `${env_1.env.FRONTEND_URL}/payment/callback`,
                payment_options: 'card,mobilemoney,ussd',
                customer: {
                    email: paymentData.customerEmail,
                    phonenumber: paymentData.customerPhone || '',
                    name: paymentData.customerName,
                },
                customizations: {
                    title: 'FarmFlow Payment',
                    description: paymentData.paymentDescription,
                    logo: 'https://your-logo-url.com/logo.png', // Replace with actual logo URL
                },
            };
            const response = await this.flutterwave.Charge.card(payload);
            if (response.status === 'success') {
                // Create transaction record
                const transactionData = {
                    transactionType: paymentData.transactionType || 'income',
                    amount: paymentData.amount,
                    date: new Date(),
                    category: paymentData.category || 'Payment',
                    description: paymentData.paymentDescription,
                    paymentMethod: 'flutterwave',
                    paymentStatus: 'pending',
                    paymentReference: payload.tx_ref,
                    customerEmail: paymentData.customerEmail,
                    customerName: paymentData.customerName,
                };
                await this.transactionService.createTransaction(transactionData, paymentData.tenantId, paymentData.userId);
                return {
                    success: true,
                    data: response.data,
                    paymentLink: response.data.link,
                    message: 'Payment initiated successfully',
                };
            }
            else {
                return {
                    success: false,
                    message: response.message || 'Payment initiation failed',
                };
            }
        }
        catch (error) {
            console.error('Payment initiation error:', error);
            return {
                success: false,
                message: 'An error occurred while initiating payment',
            };
        }
    }
    async verifyPayment(transactionId) {
        try {
            const response = await this.flutterwave.Transaction.verify({ id: transactionId });
            if (response.status === 'success' && response.data.status === 'successful') {
                // Update transaction status
                await this.transactionService.updateTransaction(response.data.tx_ref.split('_')[2], // Extract transaction ID from tx_ref
                {
                    paymentStatus: 'completed',
                    paymentId: transactionId,
                }, '', // tenantId will be handled in controller
                '' // userId will be handled in controller
                );
                return {
                    success: true,
                    data: response.data,
                    message: 'Payment verified successfully',
                };
            }
            else {
                // Update transaction status to failed
                await this.transactionService.updateTransaction(response.data.tx_ref.split('_')[2], { paymentStatus: 'failed' }, '', '');
                return {
                    success: false,
                    message: 'Payment verification failed',
                };
            }
        }
        catch (error) {
            console.error('Payment verification error:', error);
            return {
                success: false,
                message: 'An error occurred while verifying payment',
            };
        }
    }
    async handleWebhook(payload) {
        try {
            // Verify webhook signature (implement based on Flutterwave docs)
            const secretHash = env_1.env.FLUTTERWAVE_SECRET_HASH;
            // Add signature verification logic here
            const { event, data } = payload;
            if (event === 'charge.completed' && data.status === 'successful') {
                // Update transaction status
                await this.transactionService.updateTransaction(data.tx_ref.split('_')[2], {
                    paymentStatus: 'completed',
                    paymentId: data.id.toString(),
                }, '', // tenantId
                '' // userId
                );
            }
        }
        catch (error) {
            console.error('Webhook handling error:', error);
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map