import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.model';

export interface IReferral extends Document {
  referrer: IUser['_id'];
  referred: IUser['_id'];
  status: 'pending' | 'registered' | 'subscribed';
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>({
  referrer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referred: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'registered', 'subscribed'],
    default: 'registered',
  },
}, {
  timestamps: true,
});

referralSchema.index({ referrer: 1 });
referralSchema.index({ referred: 1 });

const Referral = mongoose.models.Referral || mongoose.model<IReferral>('Referral', referralSchema);

export default Referral;
