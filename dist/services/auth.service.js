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
exports.AuthService = void 0;
const tsyringe_1 = require("tsyringe");
const Referral_model_1 = __importDefault(require("../models/Referral.model"));
const BaseRepository_1 = require("../repositories/BaseRepository");
const jwt_util_1 = require("../utils/jwt.util");
const password_util_1 = require("../utils/password.util");
const errors_1 = require("../utils/errors");
let AuthService = class AuthService {
    constructor(tenantRepository, userRepository) {
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
    }
    async register(data) {
        // Check if tenant with email already exists
        const existingTenant = await this.tenantRepository.findOne({ email: data.email });
        if (existingTenant) {
            throw new errors_1.ConflictError('Farm with this email already exists');
        }
        // Handle referral
        let referrer;
        if (data.referralCode) {
            referrer = await this.userRepository.findOne({ referralCode: data.referralCode });
            // We don't block registration if the referral code is invalid.
        }
        // Create tenant
        const tenant = await this.tenantRepository.create({
            name: data.farmName,
            ownerName: data.ownerName,
            email: data.email,
            phone: data.phone,
            address: data.address,
        });
        // Create admin user for the tenant
        const hashedPassword = await (0, password_util_1.hashPassword)(data.password);
        const userObject = {
            tenantId: tenant._id,
            name: data.ownerName,
            email: data.email,
            password: hashedPassword,
            role: 'tenant_admin',
        };
        if (referrer) {
            userObject.referredBy = data.referralCode;
            userObject.referrer = referrer._id;
        }
        const user = await this.userRepository.create(userObject);
        if (referrer) {
            await Referral_model_1.default.create({
                referrer: referrer._id,
                referred: user._id,
            });
        }
        // Generate tokens
        const payload = {
            userId: user._id.toString(),
            tenantId: tenant._id.toString(),
            role: user.role,
            email: user.email,
        };
        const tokens = {
            accessToken: (0, jwt_util_1.signJWT)(payload),
            refreshToken: (0, jwt_util_1.signRefreshJWT)(payload),
        };
        return { tenant, user, tokens };
    }
    async login(data) {
        // Find user
        const user = await this.userRepository.findOne({ email: data.email });
        if (!user || !user.isActive) {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        // Check password
        const isValidPassword = await (0, password_util_1.comparePassword)(data.password, user.password);
        if (!isValidPassword) {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        // Update last login
        await this.userRepository.updateById(user._id, { lastLogin: new Date() });
        // Generate tokens
        const payload = {
            userId: user._id.toString(),
            tenantId: user.tenantId.toString(),
            role: user.role,
            email: user.email,
        };
        const tokens = {
            accessToken: (0, jwt_util_1.signJWT)(payload),
            refreshToken: (0, jwt_util_1.signRefreshJWT)(payload),
        };
        return { user, tokens };
    }
    async getUserById(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.isActive) {
            throw new errors_1.NotFoundError('User not found');
        }
        return user;
    }
    async getUsersByTenant(tenantId) {
        return this.userRepository.find({ tenantId });
    }
    async createUser(data) {
        const { email, password, tenantId } = data;
        // Check if user with email already exists in the tenant
        const existingUser = await this.userRepository.findOne({ email, tenantId });
        if (existingUser) {
            throw new errors_1.ConflictError('User with this email already exists in this farm');
        }
        // Hash password
        const hashedPassword = await (0, password_util_1.hashPassword)(password);
        // Create user
        const newUser = await this.userRepository.create({
            ...data,
            password: hashedPassword,
        });
        return newUser;
    }
    async updateUser(userId, data) {
        const user = await this.getUserById(userId);
        const updatedUser = await this.userRepository.updateById(userId, data);
        return updatedUser;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.getUserById(userId);
        const isValidPassword = await (0, password_util_1.comparePassword)(currentPassword, user.password);
        if (!isValidPassword) {
            throw new errors_1.UnauthorizedError('Current password is incorrect');
        }
        const hashedPassword = await (0, password_util_1.hashPassword)(newPassword);
        await this.userRepository.updateById(userId, { password: hashedPassword });
    }
    async refreshToken(token) {
        const decoded = (0, jwt_util_1.verifyRefreshJWT)(token);
        if (!decoded.userId) {
            throw new errors_1.UnauthorizedError('Invalid refresh token');
        }
        const user = await this.userRepository.findById(decoded.userId);
        if (!user || !user.isActive) {
            throw new errors_1.UnauthorizedError('User not found or inactive');
        }
        const payload = {
            userId: user._id.toString(),
            tenantId: user.tenantId.toString(),
            role: user.role,
            email: user.email,
        };
        const accessToken = (0, jwt_util_1.signJWT)(payload);
        return accessToken;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('TenantRepository')),
    __param(1, (0, tsyringe_1.inject)('UserRepository')),
    __metadata("design:paramtypes", [BaseRepository_1.BaseRepository,
        BaseRepository_1.BaseRepository])
], AuthService);
//# sourceMappingURL=auth.service.js.map