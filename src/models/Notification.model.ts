import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  relatedEntity?: {
    type: 'animal' | 'production' | 'event' | 'transaction' | 'feed';
    id: mongoose.Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'success'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  relatedEntity: {
    type: {
      type: String,
      enum: ['animal', 'production', 'event', 'transaction', 'feed'],
    },
    id: {
      type: Schema.Types.ObjectId,
    },
  },
}, {
  timestamps: true,
});

// Indexes
notificationSchema.index({ tenantId: 1, userId: 1 });
notificationSchema.index({ tenantId: 1, isRead: 1 });
notificationSchema.index({ tenantId: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;