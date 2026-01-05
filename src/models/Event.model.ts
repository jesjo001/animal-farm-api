import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  eventType: 'birth' | 'death' | 'vet_visit' | 'vaccination' | 'other';
  date: Date;
  animalId?: mongoose.Types.ObjectId;
  count?: number; // For births/deaths that affect multiple animals
  description?: string;
  cost?: number;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  eventType: {
    type: String,
    enum: ['birth', 'death', 'vet_visit', 'vaccination', 'other'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  animalId: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
  },
  count: {
    type: Number,
    min: 1,
  },
  description: {
    type: String,
    trim: true,
  },
  cost: {
    type: Number,
    min: 0,
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
eventSchema.index({ tenantId: 1, eventType: 1 });
eventSchema.index({ tenantId: 1, date: -1 });
eventSchema.index({ tenantId: 1, animalId: 1 });

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;