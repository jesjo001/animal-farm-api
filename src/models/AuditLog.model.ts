import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: string; // create, update, delete, login, etc.
  resource: string; // animal, production, event, etc.
  resourceId?: mongoose.Types.ObjectId;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
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
  action: {
    type: String,
    required: true,
    trim: true,
  },
  resource: {
    type: String,
    required: true,
    trim: true,
  },
  resourceId: {
    type: Schema.Types.ObjectId,
  },
  oldValues: {
    type: Schema.Types.Mixed,
  },
  newValues: {
    type: Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
    trim: true,
  },
  userAgent: {
    type: String,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false, // We use timestamp field instead
});

// Indexes
auditLogSchema.index({ tenantId: 1, timestamp: -1 });
auditLogSchema.index({ tenantId: 1, userId: 1 });
auditLogSchema.index({ tenantId: 1, resource: 1, resourceId: 1 });

const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

export default AuditLog;