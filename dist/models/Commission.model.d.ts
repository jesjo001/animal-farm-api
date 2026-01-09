import mongoose, { Document } from 'mongoose';
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
declare const Commission: mongoose.Model<ICommission, {}, {}, {}, mongoose.Document<unknown, {}, ICommission, {}, {}> & ICommission & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Commission;
//# sourceMappingURL=Commission.model.d.ts.map