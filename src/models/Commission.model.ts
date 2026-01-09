import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.model';
import { ITransaction } from './Transaction.model';

export interface ICommission extends Document {
  referrer: IUser['_id'];
  referred: IUser['_id'];
  transaction: ITransaction['_id'];
  amount: number;
  commissionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const commissionSchema = new Schema<ICommission>({
  referrer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referred: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  transaction: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  commissionRate: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

commissionSchema.index({ referrer: 1 });
commissionSchema.index({ referred: 1 });

const Commission = mongoose.models.Commission || mongoose.model<ICommission>('Commission', commissionSchema);

export default Commission;
