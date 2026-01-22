export declare class OpenAIService {
    /**
     * Analyze chick audio using OpenAI Whisper + GPT-4
     */
    static analyzeChickAudio(audioFilePath: string, trainingContext?: string): Promise<any>;
    /**
     * Use Whisper to extract audio features and patterns
     */
    private static extractAudioFeaturesWithWhisper;
    /**
     * Classify sex using GPT-4 based on audio features
     */
    private static classifyWithGPT4;
    /**
     * Build system prompt with training context
     */
    private static buildSystemPrompt;
    /**
     * Build user prompt with audio features
     */
    private static buildUserPrompt;
    /**
     * Estimate pitch from Whisper segments (helper method)
     */
    private static estimatePitchFromSegments;
    /**
     * Estimate noise level from segments
     */
    private static estimateNoiseLevel;
    /**
     * Analyze energy pattern
     */
    private static analyzeEnergyPattern;
    /**
     * Calculate frequency variation
     */
    private static calculateFrequencyVariation;
    /**
     * Fallback: Basic audio analysis without Whisper
     */
    private static basicAudioAnalysis;
    /**
     * Generate training context from validated samples
     */
    static generateTrainingContext(tenantId: string): Promise<any>;
    /**
     * Calculate average features
     */
    static calculateAverageFeatures(features: any[]): any;
    /**
     * Batch analyze multiple chicks (parallel processing with rate limiting)
     */
    static batchAnalyze(audioFiles: string[], tenantId: string): Promise<Array<any>>;
}
export default OpenAIService;
//# sourceMappingURL=openai.service.d.ts.map