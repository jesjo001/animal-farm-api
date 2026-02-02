import { Schema, model, Document } from 'mongoose';

export interface IChickSexingBatch extends Document {
  tenantId: Schema.Types.ObjectId;
  name: string;
  totalAnalyzed: number;
  maleCount: number;
  femaleCount: number;
  averageConfidence: number;
  status: 'processing' | 'completed' | 'failed';
  createdBy: Schema.Types.ObjectId;
}

const ChickSexingBatchSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true },
  totalAnalyzed: { type: Number, default: 0 },
  maleCount: { type: Number, default: 0 },
  femaleCount: { type: Number, default: 0 },
  averageConfidence: { type: Number, default: 0 },
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const ChickSexingBatchModel = model<IChickSexingBatch>('ChickSexingBatch', ChickSexingBatchSchema);