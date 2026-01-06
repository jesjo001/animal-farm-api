import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'tenant_admin' | 'manager' | 'worker';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['tenant_admin', 'manager', 'worker', 'viewer'],
    default: 'worker',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Compound index for tenant-scoped uniqueness
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });
userSchema.index({ tenantId: 1, isActive: 1 });

const User = mongoose.model<IUser>('User', userSchema);

export default User;