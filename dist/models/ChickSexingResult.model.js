"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChickSexingResultModel = void 0;
const mongoose_1 = require("mongoose");
const ChickSexingResultSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    batchId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ChickSexingBatch', required: true },
    chickNumber: { type: Number, required: true },
    audioUrl: { type: String, required: true },
    audioDuration: { type: Number, required: true },
    predictedSex: { type: String, enum: ['male', 'female'], required: true },
    confidence: { type: Number, required: true },
    status: { type: String, enum: ['success', 'low_confidence', 'failed'], required: true },
    analysisMetadata: { type: Object },
    mlModelVersion: { type: String, required: true },
}, { timestamps: true });
exports.ChickSexingResultModel = (0, mongoose_1.model)('ChickSexingResult', ChickSexingResultSchema);
//# sourceMappingURL=ChickSexingResult.model.js.map