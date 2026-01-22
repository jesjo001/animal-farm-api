"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingRunModel = void 0;
const mongoose_1 = require("mongoose");
const TrainingRunSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    versionId: { type: String, required: true },
    trainingSamples: {
        maleCount: { type: Number, required: true },
        femaleCount: { type: Number, required: true },
        totalDuration: { type: Number, required: true },
        averageQuality: { type: Number, required: true },
        sampleIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'TrainingSample' }],
    },
    status: { type: String, enum: ['training', 'completed', 'failed'], default: 'training' },
    currentEpoch: { type: Number, default: 0 },
    totalEpochs: { type: Number, default: 1 },
    initiatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    finalMetrics: { type: Object },
    epochMetrics: [{ type: Object }],
    errorMessage: { type: String },
}, { timestamps: true });
exports.TrainingRunModel = (0, mongoose_1.model)('TrainingRun', TrainingRunSchema);
//# sourceMappingURL=TrainingRun.model.js.map