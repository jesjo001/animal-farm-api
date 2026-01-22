"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingSampleModel = void 0;
const mongoose_1 = require("mongoose");
const TrainingSampleSchema = new mongoose_1.Schema({
    tenantId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    sex: { type: String, enum: ['male', 'female'], required: true },
    validatedSex: { type: String, enum: ['male', 'female'] },
    isValidated: { type: Boolean, default: false },
    features: { type: Object },
    audioUrl: { type: String, required: true },
}, { timestamps: true });
exports.TrainingSampleModel = (0, mongoose_1.model)('TrainingSample', TrainingSampleSchema);
//# sourceMappingURL=TrainingSample.model.js.map