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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralService = void 0;
const tsyringe_1 = require("tsyringe");
const BaseRepository_1 = require("../repositories/BaseRepository");
const errors_1 = require("../utils/errors");
const Referral_model_1 = __importDefault(require("../models/Referral.model"));
const Commission_model_1 = __importDefault(require("../models/Commission.model"));
let ReferralService = class ReferralService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async generateReferralCode(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        if (user.referralCode) {
            return user.referralCode;
        }
        const code = this.generateCode();
        await this.userRepository.updateById(userId, { referralCode: code });
        return code;
    }
    async getReferralDashboard(userId) {
        const referredUsers = await Referral_model_1.default.find({ referrer: userId }).populate('referred', 'name email createdAt');
        const commissions = await Commission_model_1.default.find({ referrer: userId });
        const totalEarnings = commissions.reduce((acc, commission) => acc + commission.amount, 0);
        return {
            referredUsers,
            totalEarnings,
            commissions,
        };
    }
    generateCode(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};
exports.ReferralService = ReferralService;
exports.ReferralService = ReferralService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('UserRepository')),
    __metadata("design:paramtypes", [BaseRepository_1.BaseRepository])
], ReferralService);
//# sourceMappingURL=referral.service.js.map