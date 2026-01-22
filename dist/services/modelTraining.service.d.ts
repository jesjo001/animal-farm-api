export interface TrainingParams {
    epochs?: number;
    learningRate?: number;
}
export declare class ModelTrainingService {
    /**
     * "Train" model by generating improved context from training data
     * Note: We're not actually training a model, but creating better prompts for OpenAI
     */
    static startTraining(tenantId: string, userId: string, params?: TrainingParams): Promise<{
        trainingRunId: import("mongoose").Types.ObjectId;
        versionId: string;
        status: string;
        message: string;
    }>;
    /**
     * Analyze training patterns and validate against OpenAI
     */
    private static analyzeTrainingPatterns;
    /**
     * Generate training context from samples
     */
    private static generateContextFromSamples;
    /**
     * Calculate confusion matrix
     */
    private static calculateConfusionMatrix;
    private static generateVersionId;
    private static shuffleArray;
}
//# sourceMappingURL=modelTraining.service.d.ts.map