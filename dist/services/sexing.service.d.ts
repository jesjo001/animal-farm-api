import mongoose from 'mongoose';
export interface CreateBatchDTO {
    name?: string;
}
export declare class ChickSexingService {
    /**
     * Analyze single chick using OpenAI
     */
    static analyzeSingleChick(audioFile: Express.Multer.File, tenantId: string, userId: string): Promise<{
        sex: any;
        confidence: any;
        reasoning: any;
        audioUrl: any;
        audioDuration: any;
    }>;
    /**
     * Analyze batch using OpenAI
     */
    static analyzeBatch(audioFiles: Express.Multer.File[], batchData: CreateBatchDTO, tenantId: string, userId: string): Promise<{
        batchId: string;
        status: string;
        tokensConsumed: number;
    }>;
    /**
     * Process batch with OpenAI (background)
     */
    private static processBatchWithOpenAI;
    /**
     * Upload audio file (helper)
     */
    private static uploadAudio;
    private static updateBatchCounts;
    private static finalizeBatch;
    private static handleBatchError;
    static getSexingStats(tenantId: string): Promise<{
        totalSexedToday: any;
        maleCount: any;
        femaleCount: any;
        accuracyRate: number;
        pendingAnalysis: number;
    }>;
    static getSexingBatches(tenantId: string): Promise<(mongoose.Document<unknown, {}, import("../models/ChickSexingBatch.model").IChickSexingBatch, {}, {}> & import("../models/ChickSexingBatch.model").IChickSexingBatch & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
//# sourceMappingURL=sexing.service.d.ts.map