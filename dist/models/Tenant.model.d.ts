import mongoose, { Document } from 'mongoose';
export interface ITenant extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    ownerName: string;
    email: string;
    phone?: string;
    address?: string;
    currency: string;
    isActive: boolean;
    subscriptionPlan: 'free' | 'basic' | 'premium';
    createdAt: Date;
    updatedAt: Date;
}
declare const Tenant: mongoose.Model<ITenant, {}, {}, {}, mongoose.Document<unknown, {}, ITenant, {}, {}> & ITenant & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Tenant;
//# sourceMappingURL=Tenant.model.d.ts.map