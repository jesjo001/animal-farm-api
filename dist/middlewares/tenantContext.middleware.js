"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantContext = void 0;
const errors_1 = require("../utils/errors");
const tenantContext = (req, res, next) => {
    if (!req.tenantId) {
        throw new errors_1.UnauthorizedError('Tenant context missing');
    }
    next();
};
exports.tenantContext = tenantContext;
//# sourceMappingURL=tenantContext.middleware.js.map