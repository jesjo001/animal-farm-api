"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const auth_service_1 = require("../services/auth.service");
const tsyringe_1 = require("tsyringe");
const authService = tsyringe_1.container.resolve(auth_service_1.AuthService);
const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);
        res.json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const user = await authService.updateUser(req.user.id, req.body);
        res.json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=user.controller.js.map