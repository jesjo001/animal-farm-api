"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.verifyPayment = exports.initiatePayment = void 0;
const tsyringe_1 = require("tsyringe");
const payment_service_1 = require("../services/payment.service");
const paymentService = tsyringe_1.container.resolve(payment_service_1.PaymentService);
const initiatePayment = async (req, res, next) => {
    try {
        const paymentData = {
            ...req.body,
            tenantId: req.tenantId,
            userId: req.user.id,
        };
        const result = await paymentService.initiatePayment(paymentData);
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
        const result = await paymentService.verifyPayment(transactionId);
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
        await paymentService.handleWebhook(req.body);
        res.status(200).json({ success: true, message: 'Webhook processed successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.handleWebhook = handleWebhook;
//# sourceMappingURL=payment.controller.js.map