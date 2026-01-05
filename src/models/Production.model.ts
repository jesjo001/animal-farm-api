import mongoose, { Document, Schema } from 'mongoose';

export interface IProduction extends Document {
  _id: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  date: Date;
  totalEggs: number;
  gradeBreakdown: {
    gradeA: number;
    gradeB: number;
    gradeC: number;
    broken: number;
  };
  notes?: string;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productionSchema = new Schema<IProduction>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  totalEggs: {
    type: Number,
    required: true,
    min: 0,
  },
  gradeBreakdown: {
    gradeA: { type: Number, default: 0, min: 0 },
    gradeB: { type: Number, default: 0, min: 0 },
    gradeC: { type: Number, default: 0, min: 0 },
    broken: { type: Number, default: 0, min: 0 },
  },
  notes: {
    type: String,
    trim: true,
  },
  recordedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Compound indexes
productionSchema.index({ tenantId: 1, date: 1 }, { unique: true });
productionSchema.index({ tenantId: 1, date: -1 });

const Production = mongoose.model<IProduction>('Production', productionSchema);

export default Production;