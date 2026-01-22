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
        // Mock data for now
        return {
            totalAnalyzed: 1250,
            totalBatches: 25,
            maleCount: 600,
            femaleCount: 650,
            avgConfidence: 92.5,
        };
    }
    static async getSexingBatches(tenantId) {
        // Mock data for now
        return [
            {
                _id: "63a0c6b0b5f5a6a7c8d9e0f1",
                name: "Morning Batch - Farm A",
                totalAnalyzed: 150,
                maleCount: 70,
                femaleCount: 80,
                avgConfidence: 91.2,
                status: "completed",
                createdAt: new Date("2023-12-20T09:00:00Z"),
            },
            {
                _id: "63a0c6b0b5f5a6a7c8d9e0f2",
                name: "Afternoon Batch - Farm A",
                totalAnalyzed: 200,
                maleCount: 95,
                femaleCount: 105,
                avgConfidence: 94.5,
                status: "completed",
                createdAt: new Date("2023-12-20T14:30:00Z"),
            },
            {
                _id: "63a0c6b0b5f5a6a7c8d9e0f3",
                name: "Morning Batch - Farm B",
                totalAnalyzed: 120,
                maleCount: 65,
                femaleCount: 55,
                avgConfidence: 89.8,
                status: "processing",
                createdAt: new Date("2023-12-21T09:30:00Z"),
            },
        ];
    }
}
exports.ChickSexingService = ChickSexingService;
//# sourceMappingURL=sexing.service.js.map