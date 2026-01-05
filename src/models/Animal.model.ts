import mongoose, { Document, Schema } from 'mongoose';

export interface IAnimal extends Document {
  _id: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  tagNumber: string;
  breed: string;
  type: string; // chicken, cow, pig, etc.
  birthDate: Date;
  gender: 'male' | 'female';
  location?: string;
  healthStatus: 'healthy' | 'sick' | 'injured' | 'deceased';
  weight?: number;
  weightHistory: Array<{
    weight: number;
    date: Date;
    measuredBy: mongoose.Types.ObjectId;
  }>;
  notes?: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const animalSchema = new Schema<IAnimal>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  tagNumber: {
    type: String,
    required: true,
    trim: true,
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  location: {
    type: String,
    trim: true,
  },
  healthStatus: {
    type: String,
    enum: ['healthy', 'sick', 'injured', 'deceased'],
    default: 'healthy',
  },
  weight: {
    type: Number,
  },
  weightHistory: [{
    weight: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    measuredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  }],
  notes: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Compound indexes
animalSchema.index({ tenantId: 1, tagNumber: 1 }, { unique: true });
animalSchema.index({ tenantId: 1, isActive: 1 });
animalSchema.index({ tenantId: 1, type: 1 });
animalSchema.index({ tenantId: 1, healthStatus: 1 });
animalSchema.index({ tenantId: 1, location: 1 });

const Animal = mongoose.model<IAnimal>('Animal', animalSchema);

export default Animal;