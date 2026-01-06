"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const location_controller_1 = require("../controllers/location.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/create', location_controller_1.createLocation);
router.get('/', location_controller_1.getTenantLocations);
exports.default = router;
//# sourceMappingURL=location.routes.js.map