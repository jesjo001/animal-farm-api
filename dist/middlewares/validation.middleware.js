"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const validationErrors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                next(new errors_1.ValidationError(`Validation failed: ${validationErrors.map(e => e.message).join(', ')}`));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validation.middleware.js.map