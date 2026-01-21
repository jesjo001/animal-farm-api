import { Schema, model, Document } from 'mongoose';

export interface IChickSexingResult extends Document {
  tenantId: Schema.Types.ObjectId;
  batchId: Schema.Types.ObjectId;
  chickNumber: number;
  audioUrl: string;
  audioDuration: number;
  predictedSex: 'male' | 'female';
  confidence: number;
  status: 'success' | 'low_confidence' | 'failed';
  analysisMetadata: any;
  mlModelVersion: string;
}

const ChickSexingResultSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  batchId: { type: Schema.Types.ObjectId, ref: 'ChickSexingBatch', required: true },
  chickNumber: { type: Number, required: true },
  audioUrl: { type: String, required: true },
  audioDuration: { type: Number, required: true },
  predictedSex: { type: String, enum: ['male', 'female'], required: true },
  confidence: { type: Number, required: true },
  status: { type: String, enum: ['success', 'low_confidence', 'failed'], required: true },
  analysisMetadata: { type: Object },
  mlModelVersion: { type: String, required: true },
}, { timestamps: true });

export const ChickSexingResultModel = model<IChickSexingResult>('ChickSexingResult', ChickSexingResultSchema);