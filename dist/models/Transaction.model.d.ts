import mongoose, { Document } from 'mongoose';
export interface ITransaction extends Document {
    _id: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    transactionType: 'income' | 'expense';
    amount: number;
    date: Date;
    category: string;
    productType?: string;
    description?: string;
    animalId?: mongoose.Types.ObjectId;
    recordedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Transaction: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}, {}> & ITransaction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Transaction;
//# sourceMappingURL=Transaction.model.d.ts.map