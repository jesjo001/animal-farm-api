import { Schema, model, Document } from 'mongoose';

export interface ITrainingSample extends Document {
  tenantId: Schema.Types.ObjectId;
  sex: 'male' | 'female';
  validatedSex?: 'male' | 'female';
  isValidated: boolean;
  features: any;
  audioUrl: string;
}

const TrainingSampleSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  sex: { type: String, enum: ['male', 'female'], required: true },
  validatedSex: { type: String, enum: ['male', 'female'] },
  isValidated: { type: Boolean, default: false },
  features: { type: Object },
  audioUrl: { type: String, required: true },
}, { timestamps: true });

export const TrainingSampleModel = model<ITrainingSample>('TrainingSample', TrainingSampleSchema);