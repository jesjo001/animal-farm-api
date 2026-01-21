// src/controllers/sexing.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ChickSexingService } from '../services/sexing.service';
import { matchedData } from 'express-validator';

export class ChickSexingController {
    static async analyzeSingle(req: Request, res: Response, next: NextFunction) {
        try {
            const { tenantId, userId } = req as any; // Assuming these are set by auth middleware
            const audioFile = req.file;

            if (!audioFile) {
                return res.status(400).json({ message: 'Audio file is required.' });
            }

            const result = await ChickSexingService.analyzeSingleChick(audioFile, tenantId, userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async analyzeBatch(req: Request, res: Response, next: NextFunction) {
        try {
            const { tenantId, userId } = req as any;
            const audioFiles = req.files as Express.Multer.File[];
            const batchData = matchedData(req);


            if (!audioFiles || audioFiles.length === 0) {
                return res.status(400).json({ message: 'At least one audio file is required for batch analysis.' });
            }

            const result = await ChickSexingService.analyzeBatch(audioFiles, batchData, tenantId, userId);
            res.status(202).json(result); // 202 Accepted as it's a background process
        } catch (error) {
            next(error);
        }
    }
}