"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const express_validator_1 = require("express-validator");
const location_controller_1 = require("../controllers/location.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const locationController = tsyringe_1.container.resolve(location_controller_1.LocationController);
router.use(auth_middleware_1.authMiddleware);
router.post('/', [
    (0, express_validator_1.body)('name').isString().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('type').isIn(['barn', 'pen', 'field', 'coop', 'stable']).withMessage('Invalid location type'),
    (0, express_validator_1.body)('capacity').isNumeric().withMessage('Capacity must be a number'),
    (0, express_validator_1.body)('description').optional().isString(),
], validation_middleware_1.validateRequest, locationController.createLocation);
router.get('/', locationController.getTenantLocations);
exports.default = router;
//# sourceMappingURL=location.routes.js.map