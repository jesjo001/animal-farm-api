"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const errors_1 = require("../utils/errors");
const tsyringe_1 = require("tsyringe");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.UnauthorizedError('No token provided');
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_util_1.verifyJWT)(token);
        const userRepository = tsyringe_1.container.resolve('UserRepository');
        const user = await userRepository.findById(decoded.userId);
        if (!user || !user.isActive) {
            throw new errors_1.UnauthorizedError('Invalid token');
        }
        console.log('Authenticated user:', user);
        req.user = user;
        req.tenantId = user.tenantId.toString();
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            console.error('Authorization check failed: req.user is not defined.');
            return next(new errors_1.UnauthorizedError('Insufficient permissions: Not authenticated.'));
        }
        const userRole = req.user.role?.trim();
        console.log(`--- Authorization Check ---`);
        console.log(`User: ${req.user.email}`);
        console.log(`User Role (raw): "${req.user.role}" (type: ${typeof req.user.role})`);
        console.log(`User Role (trimmed): "${userRole}" (type: ${typeof userRole})`);
        console.log(`Required Roles: [${roles.join(', ')}] (type: ${typeof roles})`);
        if (!userRole) {
            console.error('Authorization check failed: userRole is undefined or empty after trim.');
            return next(new errors_1.UnauthorizedError('Insufficient permissions: Invalid user role.'));
        }
        const isIncluded = roles.includes(userRole);
        console.log(`Check: roles.includes(userRole) => ${isIncluded}`);
        if (!isIncluded) {
            const error = new errors_1.UnauthorizedError('Insufficient permissions');
            next(error);
        }
        else {
            console.log(`Authorization successful.`);
            next();
        }
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map