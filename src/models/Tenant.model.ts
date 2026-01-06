import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  ownerName: string;
  email: string;
  phone?: string;
  address?: string;
  currency: string;
  isActive: boolean;
  subscriptionPlan: 'free' | 'basic' | 'premium';
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free',
  },
}, {
  timestamps: true,
});

// Indexes
tenantSchema.index({ isActive: 1 });

const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema);

export default Tenant;