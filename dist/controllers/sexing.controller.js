"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChickSexingController = void 0;
const sexing_service_1 = require("../services/sexing.service");
const express_validator_1 = require("express-validator");
class ChickSexingController {
    static async analyzeSingle(req, res, next) {
        try {
            const { tenantId, userId } = req; // Assuming these are set by auth middleware
            const audioFile = req.file;
            if (!audioFile) {
                return res.status(400).json({ message: 'Audio file is required.' });
            }
            const result = await sexing_service_1.ChickSexingService.analyzeSingleChick(audioFile, tenantId, userId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async analyzeBatch(req, res, next) {
        try {
            const { tenantId, userId } = req;
            const audioFiles = req.files;
            const batchData = (0, express_validator_1.matchedData)(req);
            if (!audioFiles || audioFiles.length === 0) {
                return res.status(400).json({ message: 'At least one audio file is required for batch analysis.' });
            }
            const result = await sexing_service_1.ChickSexingService.analyzeBatch(audioFiles, batchData, tenantId, userId);
            res.status(202).json(result); // 202 Accepted as it's a background process
        }
        catch (error) {
            next(error);
        }
    }
    static async getSexingStats(req, res, next) {
        try {
            const { tenantId } = req;
            const stats = await sexing_service_1.ChickSexingService.getSexingStats(tenantId);
            res.status(200).json(stats);
        }
        catch (error) {
            next(error);
        }
    }
    static async getSexingBatches(req, res, next) {
        try {
            const { tenantId } = req;
            const batches = await sexing_service_1.ChickSexingService.getSexingBatches(tenantId);
            res.status(200).json(batches);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ChickSexingController = ChickSexingController;
//# sourceMappingURL=sexing.controller.js.map