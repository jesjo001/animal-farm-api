import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedInventory extends Document {
  _id: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  feedType: string;
  quantity: number;
  unit: string; // kg, lbs, tons, etc.
  minimumThreshold: number;
  supplier?: string;
  costPerUnit?: number;
  expiryDate?: Date;
  location?: string;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const feedInventorySchema = new Schema<IFeedInventory>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  feedType: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    trim: true,
  },
  minimumThreshold: {
    type: Number,
    required: true,
    min: 0,
  },
  supplier: {
    type: String,
    trim: true,
  },
  costPerUnit: {
    type: Number,
    min: 0,
  },
  expiryDate: {
    type: Date,
  },
  location: {
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

// Indexes
feedInventorySchema.index({ tenantId: 1, feedType: 1 }, { unique: true });
feedInventorySchema.index({ tenantId: 1, quantity: 1 });

const FeedInventory = mongoose.model<IFeedInventory>('FeedInventory', feedInventorySchema);

export default FeedInventory;