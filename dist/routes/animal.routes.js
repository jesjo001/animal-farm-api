"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const animal_controller_1 = require("../controllers/animal.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const tenantContext_middleware_1 = require("../middlewares/tenantContext.middleware");
const router = (0, express_1.Router)();
// All routes require authentication and tenant context
router.use(auth_middleware_1.authenticate);
router.use(tenantContext_middleware_1.tenantContext);
router.get('/', animal_controller_1.getAnimals);
router.get('/stats', animal_controller_1.getAnimalStats);
router.post('/', (0, auth_middleware_1.authorize)('tenant_admin', 'manager'), animal_controller_1.createAnimal);
router.get('/:id', animal_controller_1.getAnimal);
router.put('/:id', (0, auth_middleware_1.authorize)('tenant_admin', 'manager'), animal_controller_1.updateAnimal);
router.delete('/:id', (0, auth_middleware_1.authorize)('tenant_admin'), animal_controller_1.deleteAnimal);
router.post('/:id/weight', (0, auth_middleware_1.authorize)('tenant_admin', 'manager', 'worker'), animal_controller_1.addWeightRecord);
router.get('/:id/weight-history', animal_controller_1.getWeightHistory);
exports.default = router;
//# sourceMappingURL=animal.routes.js.map