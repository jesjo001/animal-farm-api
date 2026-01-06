"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUsers = exports.updateProfile = exports.getProfile = void 0;
const auth_service_1 = require("../services/auth.service");
const tsyringe_1 = require("tsyringe");
const errors_1 = require("../utils/errors");
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
const getUsers = async (req, res, next) => {
    try {
        const users = await authService.getUsersByTenant(req.tenantId);
        const mappedUsers = users.map(user => ({
            ...user.toObject(),
            id: user._id.toString(),
        }));
        res.json({ success: true, data: mappedUsers });
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res, next) => {
    try {
        const loggedInUserRole = req.user.role;
        const { role: roleToCreate } = req.body;
        if (loggedInUserRole === 'manager' && roleToCreate !== 'worker') {
            throw new errors_1.AppError('Managers can only create workers.', 403);
        }
        if (loggedInUserRole === 'tenant_admin' && !['manager', 'worker', 'viewer'].includes(roleToCreate)) {
            throw new errors_1.AppError('Admins can only create managers, workers, or viewers.', 403);
        }
        const newUser = await authService.createUser({
            ...req.body,
            tenantId: req.user.tenantId,
        });
        res.status(201).json({ success: true, data: newUser });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
//# sourceMappingURL=user.controller.js.map