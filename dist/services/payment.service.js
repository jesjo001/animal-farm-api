"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiatePayment = initiatePayment;
exports.verifyPayment = verifyPayment;
exports.handleWebhook = handleWebhook;
const flutterwave_node_v3_1 = __importDefault(require("flutterwave-node-v3"));
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const User_model_1 = __importDefault(require("../models/User.model"));
const Commission_model_1 = __importDefault(require("../models/Commission.model"));
const Transaction_model_1 = __importDefault(require("../models/Transaction.model"));
// Create Flutterwave instance
const createFlutterwaveInstance = () => {
    return new flutterwave_node_v3_1.default(env_1.env.FLUTTERWAVE_PUBLIC_KEY, env_1.env.FLUTTERWAVE_SECRET_KEY);
};
async function initiatePayment(paymentData, transactionService) {
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
        // Use direct API call to create payment link since SDK doesn't have Payment.create
        const response = await axios_1.default.post('https://api.flutterwave.com/v3/payments', payload, {
            headers: {
                Authorization: `Bearer ${env_1.env.FLUTTERWAVE_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.data.status === 'success') {
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
            await transactionService.createTransaction(transactionData, paymentData.tenantId, paymentData.userId);
            return {
                success: true,
                data: response.data.data,
                paymentLink: response.data.data.link,
                message: 'Payment initiated successfully',
            };
        }
        else {
            return {
                success: false,
                message: response.data.message || 'Payment initiation failed',
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
async function verifyPayment(transactionId, transactionService) {
    try {
        const flutterwave = createFlutterwaveInstance();
        const response = await flutterwave.Transaction.verify({ id: transactionId });
        if (response.status === 'success' && response.data.status === 'successful') {
            const tx_ref = response.data.tx_ref;
            const transaction = await Transaction_model_1.default.findOne({ paymentReference: tx_ref });
            if (!transaction) {
                // This should not happen in a normal flow
                throw new Error('Transaction not found for payment verification');
            }
            // Update transaction status
            await transactionService.updateTransaction(transaction._id.toString(), {
                paymentStatus: 'completed',
                paymentId: transactionId,
            }, transaction.tenantId.toString(), transaction.recordedBy.toString());
            // Handle referral commission
            const user = await User_model_1.default.findById(transaction.recordedBy);
            if (user && user.referrer && response.data) {
                const responseData = response.data; // Explicitly cast to any
                const commissionRate = 0.20; // 20%
                const commissionAmount = (responseData.amount || 0) * commissionRate;
                await Commission_model_1.default.create({
                    referrer: user.referrer,
                    referred: user._id,
                    transaction: transaction._id,
                    amount: commissionAmount,
                    commissionRate: commissionRate,
                });
            }
            return {
                success: true,
                data: response.data,
                message: 'Payment verified successfully',
            };
        }
        else {
            const tx_ref = response.data.tx_ref;
            const transaction = await Transaction_model_1.default.findOne({ paymentReference: tx_ref });
            if (transaction) {
                // Update transaction status to failed
                await transactionService.updateTransaction(transaction._id.toString(), { paymentStatus: 'failed' }, transaction.tenantId.toString(), transaction.recordedBy.toString());
            }
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
async function handleWebhook(payload, transactionService) {
    try {
        // TODO: Verify webhook signature (implement based on Flutterwave docs)
        const secretHash = env_1.env.FLUTTERWAVE_SECRET_HASH;
        // Add signature verification logic here
        const { event, data } = payload;
        if (event === 'charge.completed' && data.status === 'successful') {
            const tx_ref = data.tx_ref;
            const transaction = await Transaction_model_1.default.findOne({ paymentReference: tx_ref });
            if (!transaction) {
                // This should not happen in a normal flow
                console.error('Transaction not found for webhook processing');
                return;
            }
            // Update transaction status
            await transactionService.updateTransaction(transaction._id.toString(), {
                paymentStatus: 'completed',
                paymentId: data.id.toString(),
            }, transaction.tenantId.toString(), transaction.recordedBy.toString());
            // Handle referral commission
            const user = await User_model_1.default.findById(transaction.recordedBy);
            if (user && user.referrer && data) {
                const webhookData = data; // Explicitly cast to any
                const commissionRate = 0.20; // 20%
                const commissionAmount = (webhookData.amount || 0) * commissionRate;
                await Commission_model_1.default.create({
                    referrer: user.referrer,
                    referred: user._id,
                    transaction: transaction._id,
                    amount: commissionAmount,
                    commissionRate: commissionRate,
                });
            }
        }
    }
    catch (error) {
        console.error('Webhook handling error:', error);
    }
}
//# sourceMappingURL=payment.service.js.map