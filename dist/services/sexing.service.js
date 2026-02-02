"use strict";
// src/services/sexing.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChickSexingService = void 0;
const openai_service_1 = require("./openai.service");
const token_service_1 = require("./token.service");
const errors_1 = require("../utils/errors");
const ChickSexingBatch_model_1 = require("../models/ChickSexingBatch.model");
const ChickSexingResult_model_1 = require("../models/ChickSexingResult.model");
const logger_1 = __importDefault(require("../config/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
class ChickSexingService {
    /**
     * Analyze single chick using OpenAI
     */
    static async analyzeSingleChick(audioFile, tenantId, userId) {
        // 1. Check token balance
        const check = await token_service_1.TokenService.checkSufficientBalance(tenantId, 1);
        if (!check.sufficient) {
            throw new errors_1.BadRequestError(`Insufficient tokens. Required: 1, Available: ${check.balance}`);
        }
        // 2. Upload audio to cloud storage
        const audioUrl = await this.uploadAudio(audioFile);
        // 3. Analyze with OpenAI
        const analysis = await openai_service_1.OpenAIService.analyzeChickAudio(audioFile.path, await openai_service_1.OpenAIService.generateTrainingContext(tenantId));
        // 4. Consume token AFTER successful analysis
        await token_service_1.TokenService.consumeTokens(tenantId, 1, 'single_analysis', audioUrl, userId, 1);
        return {
            sex: analysis.sex,
            confidence: analysis.confidence,
            reasoning: analysis.reasoning,
            audioUrl,
            audioDuration: analysis.audioFeatures.duration
        };
    }
    /**
     * Analyze batch using OpenAI
     */
    static async analyzeBatch(audioFiles, batchData, tenantId, userId) {
        const chickCount = audioFiles.length;
        // 1. Check token balance
        const check = await token_service_1.TokenService.checkSufficientBalance(tenantId, chickCount);
        if (!check.sufficient) {
            throw new errors_1.BadRequestError(`Insufficient tokens. Required: ${chickCount}, Available: ${check.balance}`);
        }
        // 2. Create batch
        const batch = await ChickSexingBatch_model_1.ChickSexingBatchModel.create({
            ...batchData,
            tenantId,
            totalAnalyzed: 0,
            maleCount: 0,
            femaleCount: 0,
            averageConfidence: 0,
            status: 'processing',
            createdBy: userId
        });
        // 3. Consume tokens immediately
        await token_service_1.TokenService.consumeTokens(tenantId, chickCount, 'batch_analysis', batch._id.toString(), userId, chickCount);
        // 4. Process with OpenAI (async)
        this.processBatchWithOpenAI(audioFiles, batch._id.toString(), tenantId);
        return {
            batchId: batch._id.toString(),
            status: 'processing',
            tokensConsumed: chickCount
        };
    }
    /**
     * Process batch with OpenAI (background)
     */
    static async processBatchWithOpenAI(audioFiles, batchId, tenantId) {
        try {
            // Upload all files first
            const uploadPromises = audioFiles.map(file => this.uploadAudio(file));
            const audioUrls = await Promise.all(uploadPromises);
            // Analyze with OpenAI batch processing
            const analyses = await openai_service_1.OpenAIService.batchAnalyze(audioFiles.map(f => f.path), tenantId);
            // Save results
            for (let i = 0; i < analyses.length; i++) {
                const analysis = analyses[i];
                const audioUrl = audioUrls[i];
                const status = analysis.confidence < 60 ? 'low_confidence' : 'success';
                await ChickSexingResult_model_1.ChickSexingResultModel.create({
                    tenantId,
                    batchId,
                    chickNumber: i + 1,
                    audioUrl,
                    audioDuration: analysis.audioFeatures?.duration || 0,
                    predictedSex: analysis.sex,
                    confidence: analysis.confidence,
                    status,
                    analysisMetadata: {
                        reasoning: analysis.reasoning,
                        ...analysis.audioFeatures
                    },
                    mlModelVersion: 'openai-gpt4o'
                });
                // Update batch counts
                await this.updateBatchCounts(batchId, analysis.sex);
            }
            // Finalize batch
            await this.finalizeBatch(batchId);
        }
        catch (error) {
            logger_1.default.error(`Batch processing failed for ${batchId}:`, error.message);
            await this.handleBatchError(batchId, error);
        }
    }
    /**
     * Upload audio file (helper)
     */
    static async uploadAudio(file) {
        // Use existing Cloudinary upload logic
        const cloudinary = require('cloudinary').v2;
        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: 'video', // Audio files use video resource type
            folder: 'farmflow/chick-audio'
        });
        return result.secure_url;
    }
    static async updateBatchCounts(batchId, sex) {
        const batch = await ChickSexingBatch_model_1.ChickSexingBatchModel.findById(batchId);
        if (batch) {
            if (sex === 'male') {
                batch.maleCount++;
            }
            else {
                batch.femaleCount++;
            }
            batch.totalAnalyzed++;
            await batch.save();
        }
    }
    static async finalizeBatch(batchId) {
        const batch = await ChickSexingBatch_model_1.ChickSexingBatchModel.findById(batchId);
        if (batch) {
            batch.status = 'completed';
            await batch.save();
        }
    }
    static async handleBatchError(batchId, error) {
        const batch = await ChickSexingBatch_model_1.ChickSexingBatchModel.findById(batchId);
        if (batch) {
            batch.status = 'failed';
            await batch.save();
        }
    }
    static async getSexingStats(tenantId) {
        const tenantObjectId = new mongoose_1.default.Types.ObjectId(tenantId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayResultsPromise = ChickSexingResult_model_1.ChickSexingResultModel.aggregate([
            {
                $match: {
                    tenantId: tenantObjectId,
                    createdAt: { $gte: today, $lt: tomorrow },
                },
            },
            {
                $group: {
                    _id: null,
                    totalSexedToday: { $sum: 1 },
                    maleCount: {
                        $sum: {
                            $cond: [{ $eq: ['$predictedSex', 'male'] }, 1, 0],
                        },
                    },
                    femaleCount: {
                        $sum: {
                            $cond: [{ $eq: ['$predictedSex', 'female'] }, 1, 0],
                        },
                    },
                    avgConfidence: { $avg: '$confidence' },
                },
            },
        ]);
        const pendingAnalysisPromise = ChickSexingBatch_model_1.ChickSexingBatchModel.countDocuments({
            tenantId: tenantObjectId,
            status: 'processing',
        });
        const [todayStats, pendingAnalysis] = await Promise.all([
            todayResultsPromise,
            pendingAnalysisPromise,
        ]);
        const stats = todayStats[0] || {};
        return {
            totalSexedToday: stats.totalSexedToday || 0,
            maleCount: stats.maleCount || 0,
            femaleCount: stats.femaleCount || 0,
            accuracyRate: stats.avgConfidence ? parseFloat(stats.avgConfidence.toFixed(1)) : 100,
            pendingAnalysis: pendingAnalysis || 0,
        };
    }
    static async getSexingBatches(tenantId) {
        const tenantObjectId = new mongoose_1.default.Types.ObjectId(tenantId);
        const batches = await ChickSexingBatch_model_1.ChickSexingBatchModel.find({ tenantId: tenantObjectId })
            .sort({ createdAt: -1 })
            .limit(50);
        return batches;
    }
}
exports.ChickSexingService = ChickSexingService;
//# sourceMappingURL=sexing.service.js.map