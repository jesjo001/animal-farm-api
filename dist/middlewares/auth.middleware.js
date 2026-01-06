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
        // Log the authorization attempt for debugging
        if (req.user) {
            console.log(`Authorizing user ${req.user.email}. Role: "${req.user.role}" (length: ${req.user.role.length}). Required roles: [${roles.join(', ')}]`);
            const charCodes = req.user.role.split('').map(c => c.charCodeAt(0)).join(', ');
            console.log(`Role char codes: [${charCodes}]`);
        }
        const userRole = req.user?.role?.trim(); // Trim potential whitespace
        if (!req.user || !userRole || !roles.includes(userRole)) {
            const error = new errors_1.UnauthorizedError('Insufficient permissions');
            next(error);
        }
        else {
            next();
        }
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map