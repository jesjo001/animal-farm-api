"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
router.get('/profile', user_controller_1.getProfile);
router.put('/profile', user_controller_1.updateProfile);
exports.default = router;
//# sourceMappingURL=user.routes.js.map