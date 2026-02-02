import { Request, Response, NextFunction } from 'express';
import { TrainingRunModel } from '../models/TrainingRun.model';
import { TrainingSampleModel } from '../models/TrainingSample.model';
import { ModelTrainingService } from '../services/modelTraining.service';
import { TrainingDataService } from '../services/trainingData.service';

const DEFAULT_REQUIRED_SAMPLES_PER_SEX = 100;

export const getTrainingModelInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId!;

    const [latestRun, stats] = await Promise.all([
      TrainingRunModel.findOne({ tenantId }).sort({ createdAt: -1 }),
      TrainingDataService.getStats(tenantId)
    ]);

    if (!latestRun) {
      return res.json({
        success: true,
        data: {
          version: 'v0.0.0',
          trainingDate: null,
          totalSamples: stats.maleCount + stats.femaleCount,
          accuracy: 0,
          status: 'pending_deployment'
        }
      });
    }

    const totalSamples = latestRun.trainingSamples?.maleCount + latestRun.trainingSamples?.femaleCount || 0;
    const accuracy = latestRun.finalMetrics?.validationAccuracy ?? latestRun.finalMetrics?.trainingAccuracy ?? 0;
    const status = latestRun.status === 'training'
      ? 'training'
      : latestRun.status === 'completed'
        ? 'active'
        : 'pending_deployment';

    res.json({
      success: true,
      data: {
        version: latestRun.versionId,
        trainingDate: latestRun.endTime ?? latestRun.startTime,
        totalSamples,
        accuracy: Number(accuracy.toFixed(2)),
        status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTrainingStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId!;
    const stats = await TrainingDataService.getStats(tenantId);

    const totalSamples = stats.maleCount + stats.femaleCount;
    const balanceRatio = totalSamples > 0 ? (stats.maleCount / totalSamples) * 100 : 0;
    const qualityScore = stats.averageQuality ?? 0;

    const maleStatus = stats.maleCount >= DEFAULT_REQUIRED_SAMPLES_PER_SEX ? 'sufficient' : 'need_more';
    const femaleStatus = stats.femaleCount >= DEFAULT_REQUIRED_SAMPLES_PER_SEX ? 'sufficient' : 'need_more';
    const qualityStatus = qualityScore >= 80 ? 'high' : qualityScore >= 60 ? 'medium' : 'low';

    res.json({
      success: true,
      data: {
        maleSamples: stats.maleCount,
        maleDuration: stats.totalDuration ?? 0,
        maleStatus,
        femaleSamples: stats.femaleCount,
        femaleDuration: stats.totalDuration ?? 0,
        femaleStatus,
        balanceRatio,
        qualityScore,
        qualityStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTrainingSamples = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId!;
    const { sex } = req.query;

    const filter: Record<string, any> = { tenantId };

    if (sex === 'male' || sex === 'female') {
      filter.$or = [
        { validatedSex: sex },
        { sex }
      ];
    }

    const samples = await TrainingSampleModel.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: samples.map(sample => ({
        id: sample._id.toString(),
        audioUrl: sample.audioUrl,
        sex: sample.validatedSex ?? sample.sex,
        duration: sample.features?.duration ?? 0,
        qualityScore: sample.features?.qualityScore ?? 0,
        uploadedBy: sample.features?.uploadedBy ?? 'System',
        uploadedAt: sample.createdAt,
        validated: sample.isValidated,
        breed: sample.features?.breed,
        age: sample.features?.age,
        environment: sample.features?.environment,
        notes: sample.features?.notes,
        confidenceLevel: sample.features?.confidenceLevel ?? 0
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const startTraining = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId!;
    const userId = req.user!.id;
    const params = req.body?.params ?? undefined;

    const result = await ModelTrainingService.startTraining(tenantId, userId, params);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const validateTrainingSample = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId!;
    const { id } = req.params;
    const { validatedSex } = req.body;

    const updated = await TrainingSampleModel.findOneAndUpdate(
      { _id: id, tenantId },
      {
        isValidated: true,
        ...(validatedSex ? { validatedSex } : {})
      },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteTrainingSamples = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId!;
    const { sampleIds } = req.body as { sampleIds: string[] };

    if (!Array.isArray(sampleIds) || sampleIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'sampleIds must be a non-empty array' }
      });
    }

    const result = await TrainingSampleModel.deleteMany({
      tenantId,
      _id: { $in: sampleIds }
    });

    res.json({
      success: true,
      data: {
        deletedCount: result.deletedCount || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
