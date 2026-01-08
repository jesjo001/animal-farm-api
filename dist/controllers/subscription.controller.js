"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = void 0;
const tsyringe_1 = require("tsyringe");
const subscription_service_1 = require("../services/subscription.service");
const subscriptionService = tsyringe_1.container.resolve(subscription_service_1.SubscriptionService);
const createSubscription = async (req, res, next) => {
    try {
        const subscriptionData = {
            plan: req.body.plan,
            amount: req.body.amount,
            tenantId: req.tenantId,
            userId: req.user.id,
            paymentReference: req.body.paymentReference,
        };
        const result = await subscriptionService.createSubscription(subscriptionData);
        if (result.success) {
            res.status(201).json({ success: true, data: result });
        }
        else {
            res.status(400).json({ success: false, message: 'Failed to create subscription' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.createSubscription = createSubscription;
//# sourceMappingURL=subscription.controller.js.map