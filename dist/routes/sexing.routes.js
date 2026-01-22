"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/sexing.routes.ts
const express_1 = require("express");
const sexing_controller_1 = require("../controllers/sexing.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const tenantContext_middleware_1 = require("../middlewares/tenantContext.middleware");
const openai_rateLimit_middleware_1 = require("../middlewares/openai.rateLimit.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// All routes require authentication and tenant context
router.use(auth_middleware_1.authenticate);
router.use(tenantContext_middleware_1.tenantContext);
// Apply rate limiters
router.use(openai_rateLimit_middleware_1.openAIRateLimiter);
router.use(openai_rateLimit_middleware_1.tenantAnalysisLimiter);
router.post('/analyze/single', upload_middleware_1.upload.single('audio'), sexing_controller_1.ChickSexingController.analyzeSingle);
router.post('/analyze/batch', upload_middleware_1.upload.array('audio', 50), // Allow up to 50 files
[
    (0, express_validator_1.body)('name').notEmpty().withMessage('Batch name is required.')
], sexing_controller_1.ChickSexingController.analyzeBatch);
router.get('/stats', sexing_controller_1.ChickSexingController.getSexingStats);
router.get('/batches', sexing_controller_1.ChickSexingController.getSexingBatches);
exports.default = router;
//# sourceMappingURL=sexing.routes.js.map