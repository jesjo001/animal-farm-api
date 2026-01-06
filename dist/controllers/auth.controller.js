"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getMe = exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const tsyringe_1 = require("tsyringe");
const validators_1 = require("../utils/validators");
function getAuthService() {
    return tsyringe_1.container.resolve(auth_service_1.AuthService);
}
const register = async (req, res, next) => {
    try {
        const data = validators_1.registerSchema.parse(req.body);
        const result = await getAuthService().register(data);
        res.status(201).json({
            success: true,
            message: 'Farm registered successfully',
            data: {
                tenant: result.tenant,
                user: result.user,
                tokens: result.tokens,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const data = validators_1.loginSchema.parse(req.body);
        const result = await getAuthService().login(data);
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: result.user,
                tokens: result.tokens,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // You might want to implement token blacklisting for enhanced security
        res.json({
            success: true,
            message: 'Logout successful',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const refreshToken = async (req, res, next) => {
    try {
        // Implement refresh token logic
        // This would require storing refresh tokens and validating them
        res.json({
            success: true,
            message: 'Token refresh not implemented yet',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const forgotPassword = async (req, res, next) => {
    try {
        // Implement forgot password logic
        res.json({
            success: true,
            message: 'Password reset email sent',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        // Implement reset password logic
        res.json({
            success: true,
            message: 'Password reset successful',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
const getMe = async (req, res, next) => {
    try {
        const user = await getAuthService().getUserById(req.user._id.toString());
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const changePassword = async (req, res, next) => {
    try {
        const data = validators_1.changePasswordSchema.parse(req.body);
        await getAuthService().changePassword(req.user._id.toString(), data.currentPassword, data.newPassword);
        res.json({
            success: true,
            message: 'Password changed successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map