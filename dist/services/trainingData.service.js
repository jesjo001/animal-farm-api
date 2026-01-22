"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingDataService = void 0;
// src/services/trainingData.service.ts
const TrainingSample_model_1 = require("../models/TrainingSample.model");
class TrainingDataService {
    static async getStats(tenantId) {
        const samples = await TrainingSample_model_1.TrainingSampleModel.find({ tenantId, isValidated: true });
        const maleCount = samples.filter(s => s.validatedSex === 'male').length;
        const femaleCount = samples.filter(s => s.validatedSex === 'female').length;
        return {
            sufficientData: { total: samples.length > 200 },
            maleCount,
            femaleCount,
            totalDuration: 0, // Placeholder
            averageQuality: 0, // Placeholder
        };
    }
}
exports.TrainingDataService = TrainingDataService;
//# sourceMappingURL=trainingData.service.js.map