"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChickSexingBatchModel = void 0;
const mongoose_1 = require("mongoose");
const ChickSexingBatchSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    totalAnalyzed: { type: Number, default: 0 },
    maleCount: { type: Number, default: 0 },
    femaleCount: { type: Number, default: 0 },
    averageConfidence: { type: Number, default: 0 },
    status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
exports.ChickSexingBatchModel = (0, mongoose_1.model)('ChickSexingBatch', ChickSexingBatchSchema);
//# sourceMappingURL=ChickSexingBatch.model.js.map