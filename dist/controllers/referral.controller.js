"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferralDashboard = exports.generateReferralCode = void 0;
const tsyringe_1 = require("tsyringe");
const referral_service_1 = require("../services/referral.service");
const generateReferralCode = async (req, res, next) => {
    try {
        const referralService = tsyringe_1.container.resolve(referral_service_1.ReferralService);
        const code = await referralService.generateReferralCode(req.user._id.toString());
        res.status(200).json({ code });
    }
    catch (error) {
        next(error);
    }
};
exports.generateReferralCode = generateReferralCode;
const getReferralDashboard = async (req, res, next) => {
    try {
        const referralService = tsyringe_1.container.resolve(referral_service_1.ReferralService);
        const dashboardData = await referralService.getReferralDashboard(req.user._id.toString());
        res.status(200).json(dashboardData);
    }
    catch (error) {
        next(error);
    }
};
exports.getReferralDashboard = getReferralDashboard;
//# sourceMappingURL=referral.controller.js.map