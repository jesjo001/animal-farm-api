import { Schema, model, Document } from 'mongoose';

export interface ITrainingRun extends Document {
  tenantId: Schema.Types.ObjectId;
  versionId: string;
  trainingSamples: {
    maleCount: number;
    femaleCount: number;
    totalDuration: number;
    averageQuality: number;
    sampleIds: Schema.Types.ObjectId[];
  };
  status: 'training' | 'completed' | 'failed';
  currentEpoch: number;
  totalEpochs: number;
  initiatedBy: Schema.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  finalMetrics?: any;
  epochMetrics?: any[];
  errorMessage?: string;
}

const TrainingRunSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  versionId: { type: String, required: true },
  trainingSamples: {
    maleCount: { type: Number, required: true },
    femaleCount: { type: Number, required: true },
    totalDuration: { type: Number, required: true },
    averageQuality: { type: Number, required: true },
    sampleIds: [{ type: Schema.Types.ObjectId, ref: 'TrainingSample' }],
  },
  status: { type: String, enum: ['training', 'completed', 'failed'], default: 'training' },
  currentEpoch: { type: Number, default: 0 },
  totalEpochs: { type: Number, default: 1 },
  initiatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  finalMetrics: { type: Object },
  epochMetrics: [{ type: Object }],
  errorMessage: { type: String },
}, { timestamps: true });

export const TrainingRunModel = model<ITrainingRun>('TrainingRun', TrainingRunSchema);