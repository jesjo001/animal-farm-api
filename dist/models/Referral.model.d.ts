import mongoose, { Document } from 'mongoose';
import { IUser } from './User.model';
export interface IReferral extends Document {
    referrer: IUser['_id'];
    referred: IUser['_id'];
    status: 'pending' | 'registered' | 'subscribed';
    createdAt: Date;
    updatedAt: Date;
}
declare const Referral: mongoose.Model<any, {}, {}, {}, any, any>;
export default Referral;
//# sourceMappingURL=Referral.model.d.ts.map