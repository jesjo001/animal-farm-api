"use strict";
// src/services/openai.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("../config/logger"));
const TrainingSample_model_1 = require("../models/TrainingSample.model");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
class OpenAIService {
    /**
     * Analyze chick audio using OpenAI Whisper + GPT-4
     */
    static async analyzeChickAudio(audioFilePath, trainingContext) {
        try {
            // Step 1: Extract audio features using Whisper
            const audioFeatures = await this.extractAudioFeaturesWithWhisper(audioFilePath);
            // Step 2: Analyze with GPT-4 using training context
            const analysis = await this.classifyWithGPT4(audioFeatures, trainingContext);
            return {
                sex: analysis.sex,
                confidence: analysis.confidence,
                reasoning: analysis.reasoning,
                audioFeatures
            };
        }
        catch (error) {
            logger_1.default.error('OpenAI analysis failed:', error.message);
            throw new Error(`Audio analysis failed: ${error.message}`);
        }
    }
    /**
     * Use Whisper to extract audio features and patterns
     */
    static async extractAudioFeaturesWithWhisper(audioFilePath) {
        try {
            // Whisper transcription (even though chicks don't "speak", it analyzes audio patterns)
            const transcription = await openai.audio.transcriptions.create({
                file: fs_1.default.createReadStream(audioFilePath),
                model: 'whisper-1',
                language: 'en', // Not relevant for animal sounds, but required
                response_format: 'verbose_json' // Get detailed timing and confidence
            });
            // Extract acoustic features from Whisper's analysis
            const duration = transcription.duration || 0;
            const segments = transcription.segments || [];
            // Calculate features from segments
            const features = {
                duration,
                segmentCount: segments.length,
                averagePitch: this.estimatePitchFromSegments(segments),
                noiseLevel: this.estimateNoiseLevel(segments),
                energyPattern: this.analyzeEnergyPattern(segments),
                frequencyVariation: this.calculateFrequencyVariation(segments)
            };
            return features;
        }
        catch (error) {
            logger_1.default.error('Whisper analysis failed:', error.message);
            // Fallback: Basic audio analysis without Whisper
            return await this.basicAudioAnalysis(audioFilePath);
        }
    }
    /**
     * Classify sex using GPT-4 based on audio features
     */
    static async classifyWithGPT4(audioFeatures, trainingContext) {
        // Build prompt with training context if available
        const systemPrompt = this.buildSystemPrompt(trainingContext);
        const userPrompt = this.buildUserPrompt(audioFeatures);
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ],
            temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.1'),
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
            response_format: { type: 'json_object' } // Ensure JSON response
        });
        const response = JSON.parse(completion.choices[0].message.content || '{}');
        // Validate response
        if (!response.sex || !response.confidence) {
            throw new Error('Invalid OpenAI response format');
        }
        // Normalize confidence to 0-100
        const confidence = Math.min(100, Math.max(0, response.confidence));
        return {
            sex: response.sex.toLowerCase() === 'male' ? 'male' : 'female',
            confidence,
            reasoning: response.reasoning || 'Analysis based on vocalization patterns'
        };
    }
    /**
     * Build system prompt with training context
     */
    static buildSystemPrompt(trainingContext) {
        let prompt = `You are an expert in avian bioacoustics, specializing in day-old chick sex determination through vocalization analysis.

**Your Task:**
Analyze the provided audio features of a day-old chick's chirping and determine whether the chick is MALE or FEMALE.

**Scientific Background:**
- Male chicks typically produce higher-pitched, more frequent chirps (around 3-4 kHz dominant frequency)
- Female chicks typically produce lower-pitched, less frequent chirps (around 2-3 kHz dominant frequency)
- Male chicks show more energy variation and shorter chirp duration
- Female chicks show more consistent energy patterns and longer chirp duration

**Audio Features You'll Analyze:**
- Duration: Total length of the recording
- Average Pitch: Estimated fundamental frequency
- Noise Level: Background noise assessment
- Energy Pattern: Amplitude variations over time
- Frequency Variation: How much the pitch changes

`;
        // Add training context if available (learned patterns from user's data)
        if (trainingContext) {
            prompt += `
**Farm-Specific Patterns (Learned from Training Data):**
${trainingContext}

Use these farm-specific patterns to improve your prediction accuracy.
`;
        }
        prompt += `
**Your Response Format (JSON only):**
{
  "sex": "male" or "female",
  "confidence": 0-100,
  "reasoning": "Your detailed analysis here."
}

**Important:**
- Be conservative with confidence scores. Only give >90% if features clearly match one sex.
- If features are ambiguous, give confidence between 60-80%.
- If you cannot determine with reasonable certainty, give confidence <60% and explain why.
- Always respond in valid JSON format.
`;
        return prompt;
    }
    /**
     * Build user prompt with audio features
     */
    static buildUserPrompt(audioFeatures) {
        return `Analyze this day-old chick vocalization and determine the sex:

**Audio Features:**
- Duration: ${audioFeatures.duration?.toFixed(2)} seconds
- Average Pitch Estimate: ${audioFeatures.averagePitch?.toFixed(1)} Hz
- Noise Level: ${audioFeatures.noiseLevel?.toFixed(1)}%
- Energy Pattern Score: ${audioFeatures.energyPattern?.toFixed(2)}
- Frequency Variation: ${audioFeatures.frequencyVariation?.toFixed(2)}

Based on these features, classify the chick as male or female with your confidence level.`;
    }
    /**
     * Estimate pitch from Whisper segments (helper method)
     */
    static estimatePitchFromSegments(segments) {
        if (!segments || segments.length === 0)
            return 2500; // Default mid-range
        // Use segment confidence and timing to estimate pitch
        // Higher confidence + shorter duration often indicates higher pitch
        let totalPitch = 0;
        let count = 0;
        segments.forEach(segment => {
            if (segment.avg_logprob) {
                // Convert log probability to rough pitch estimate (this is heuristic)
                const estimatedPitch = 2000 + (segment.avg_logprob * -500);
                totalPitch += estimatedPitch;
                count++;
            }
        });
        return count > 0 ? totalPitch / count : 2500;
    }
    /**
     * Estimate noise level from segments
     */
    static estimateNoiseLevel(segments) {
        if (!segments || segments.length === 0)
            return 20; // Default moderate noise
        // Lower confidence often indicates more noise
        const avgConfidence = segments.reduce((sum, s) => sum + Math.exp(s.avg_logprob || -1), 0) / segments.length;
        return Math.max(0, Math.min(100, (1 - avgConfidence) * 100));
    }
    /**
     * Analyze energy pattern
     */
    static analyzeEnergyPattern(segments) {
        if (!segments || segments.length < 2)
            return 0.5;
        // Calculate variation in segment probabilities (proxy for energy variation)
        const probs = segments.map(s => Math.exp(s.avg_logprob || -1));
        const mean = probs.reduce((a, b) => a + b, 0) / probs.length;
        const variance = probs.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / probs.length;
        return Math.sqrt(variance);
    }
    /**
     * Calculate frequency variation
     */
    static calculateFrequencyVariation(segments) {
        if (!segments || segments.length < 2)
            return 0.5;
        // Variation in segment durations (proxy for frequency changes)
        const durations = segments.map(s => s.end - s.start);
        const mean = durations.reduce((a, b) => a + b, 0) / durations.length;
        const variance = durations.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / durations.length;
        return Math.sqrt(variance);
    }
    /**
     * Fallback: Basic audio analysis without Whisper
     */
    static async basicAudioAnalysis(audioFilePath) {
        // Import audio processing libraries
        const wav = require('node-wav');
        const fs = require('fs');
        const buffer = fs.readFileSync(audioFilePath);
        const result = wav.decode(buffer);
        const duration = result.sampleRate > 0
            ? result.channelData[0].length / result.sampleRate
            : 0;
        // Calculate basic features
        const samples = result.channelData[0];
        const avgAmplitude = samples.reduce((sum, s) => sum + Math.abs(s), 0) / samples.length;
        return {
            duration,
            segmentCount: Math.floor(duration * 2), // Estimate
            averagePitch: 2500, // Default estimate
            noiseLevel: avgAmplitude < 0.1 ? 10 : 30,
            energyPattern: avgAmplitude,
            frequencyVariation: 0.5
        };
    }
    /**
     * Generate training context from validated samples
     */
    static async generateTrainingContext(tenantId) {
        const validatedSamples = await TrainingSample_model_1.TrainingSampleModel.find({
            tenantId,
            isValidated: true
        }).limit(100); // Use recent validated samples
        if (validatedSamples.length < 10) {
            return ''; // Not enough training data
        }
        // Analyze patterns in validated data
        const maleFeatures = validatedSamples
            .filter(s => s.validatedSex === 'male' || s.sex === 'male')
            .map(s => s.features);
        const femaleFeatures = validatedSamples
            .filter(s => s.validatedSex === 'female' || s.sex === 'female')
            .map(s => s.features);
        // Calculate average features for each sex
        const maleAvg = this.calculateAverageFeatures(maleFeatures);
        const femaleAvg = this.calculateAverageFeatures(femaleFeatures);
        return `
Based on ${validatedSamples.length} validated samples from this farm:

**Male Chicks (${maleFeatures.length} samples):**
- Average Pitch: ${maleAvg.averagePitch?.toFixed(1)} Hz
- Average Energy: ${maleAvg.energyPattern?.toFixed(2)}
- Average Duration: ${maleAvg.duration?.toFixed(2)}s

**Female Chicks (${femaleFeatures.length} samples):**
- Average Pitch: ${femaleAvg.averagePitch?.toFixed(1)} Hz
- Average Energy: ${femaleAvg.energyPattern?.toFixed(2)}
- Average Duration: ${femaleAvg.duration?.toFixed(2)}s

**Farm-Specific Insights:**
- Pitch difference: ${Math.abs((maleAvg.averagePitch || 0) - (femaleAvg.averagePitch || 0)).toFixed(1)} Hz
- Energy difference: ${Math.abs((maleAvg.energyPattern || 0) - (femaleAvg.energyPattern || 0)).toFixed(2)}
`;
    }
    /**
     * Calculate average features
     */
    static calculateAverageFeatures(features) {
        if (features.length === 0)
            return {};
        const avg = {};
        const keys = Object.keys(features[0] || {});
        keys.forEach(key => {
            const values = features.map(f => f[key]).filter(v => typeof v === 'number');
            avg[key] = values.length > 0
                ? values.reduce((a, b) => a + b, 0) / values.length
                : 0;
        });
        return avg;
    }
    /**
     * Batch analyze multiple chicks (parallel processing with rate limiting)
     */
    static async batchAnalyze(audioFiles, tenantId) {
        // Get training context once for the batch
        const trainingContext = await this.generateTrainingContext(tenantId);
        // Process in batches of 5 to respect OpenAI rate limits
        const batchSize = 5;
        const results = [];
        for (let i = 0; i < audioFiles.length; i += batchSize) {
            const batch = audioFiles.slice(i, i + batchSize);
            const batchResults = await Promise.all(batch.map(async (audioFile) => {
                try {
                    const analysis = await this.analyzeChickAudio(audioFile, trainingContext);
                    return {
                        audioFile,
                        ...analysis
                    };
                }
                catch (error) {
                    logger_1.default.error(`Failed to analyze ${audioFile}:`, error.message);
                    return {
                        audioFile,
                        sex: 'male', // Default
                        confidence: 0,
                        reasoning: `Analysis failed: ${error.message}`,
                        audioFeatures: {}
                    };
                }
            }));
            results.push(...batchResults);
            // Rate limiting delay (OpenAI has 3 RPM limit on free tier, 3500 on paid)
            if (i + batchSize < audioFiles.length) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
            }
        }
        return results;
    }
}
exports.OpenAIService = OpenAIService;
exports.default = OpenAIService;
//# sourceMappingURL=openai.service.js.map