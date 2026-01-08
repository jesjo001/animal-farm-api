import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  transactionType: 'income' | 'expense';
  amount: number;
  date: Date;
  category: string;
  productType?: string; // For income: egg sales, meat sales, etc.
  description?: string;
  animalId?: mongoose.Types.ObjectId; // For animal-specific transactions
  recordedBy: mongoose.Types.ObjectId;
  // Payment gateway fields
  paymentMethod?: 'cash' | 'bank_transfer' | 'mobile_money' | 'credit_card' | 'check' | 'flutterwave';
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentReference?: string; // Flutterwave transaction reference
  paymentId?: string; // Flutterwave payment ID
  customerEmail?: string;
  customerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  transactionType: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  productType: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  animalId: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
  },
  recordedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Payment gateway fields
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'mobile_money', 'credit_card', 'check', 'flutterwave'],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  },
  paymentReference: {
    type: String,
    trim: true,
  },
  paymentId: {
    type: String,
    trim: true,
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  customerName: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes
transactionSchema.index({ tenantId: 1, transactionType: 1 });
transactionSchema.index({ tenantId: 1, date: -1 });
transactionSchema.index({ tenantId: 1, category: 1 });

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;