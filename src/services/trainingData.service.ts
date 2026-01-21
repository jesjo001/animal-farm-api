// src/services/trainingData.service.ts
import { TrainingSampleModel } from '../models/TrainingSample.model';

export class TrainingDataService {
    static async getStats(tenantId: string): Promise<any> {
        const samples = await TrainingSampleModel.find({ tenantId, isValidated: true });
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