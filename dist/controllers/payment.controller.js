"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.verifyPayment = exports.initiatePayment = void 0;
const tsyringe_1 = require("tsyringe");
const payment_service_1 = require("../services/payment.service");
const transaction_service_1 = require("../services/transaction.service");
const transactionService = tsyringe_1.container.resolve(transaction_service_1.TransactionService);
const initiatePayment = async (req, res, next) => {
    try {
        const paymentData = {
            ...req.body,
            tenantId: req.tenantId,
            userId: req.user.id,
        };
        const result = await (0, payment_service_1.initiatePayment)(paymentData, transactionService);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.initiatePayment = initiatePayment;
const verifyPayment = async (req, res, next) => {
    try {
        const { transactionId } = req.params;
        const result = await (0, payment_service_1.verifyPayment)(transactionId, transactionService);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.verifyPayment = verifyPayment;
const handleWebhook = async (req, res, next) => {
    try {
        await (0, payment_service_1.handleWebhook)(req.body, transactionService);
        res.status(200).json({ success: true, message: 'Webhook processed successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.handleWebhook = handleWebhook;
//# sourceMappingURL=payment.controller.js.map