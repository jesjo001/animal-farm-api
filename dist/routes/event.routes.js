"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const tenantContext_middleware_1 = require("../middlewares/tenantContext.middleware");
const router = (0, express_1.Router)();
// All routes require authentication and tenant context
router.use(auth_middleware_1.authenticate);
router.use(tenantContext_middleware_1.tenantContext);
router.get('/', event_controller_1.getEvents);
router.post('/', (0, auth_middleware_1.authorize)('tenant_admin', 'manager'), event_controller_1.createEvent);
router.get('/:id', event_controller_1.getEvent);
router.put('/:id', (0, auth_middleware_1.authorize)('tenant_admin', 'manager'), event_controller_1.updateEvent);
router.delete('/:id', (0, auth_middleware_1.authorize)('tenant_admin', 'manager'), event_controller_1.deleteEvent);
exports.default = router;
//# sourceMappingURL=event.routes.js.map