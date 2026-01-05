import mongoose, { Document } from 'mongoose';
export interface IFeedInventory extends Document {
    _id: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    feedType: string;
    quantity: number;
    unit: string;
    minimumThreshold: number;
    supplier?: string;
    costPerUnit?: number;
    expiryDate?: Date;
    location?: string;
    recordedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const FeedInventory: mongoose.Model<IFeedInventory, {}, {}, {}, mongoose.Document<unknown, {}, IFeedInventory, {}, {}> & IFeedInventory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default FeedInventory;
//# sourceMappingURL=FeedInventory.model.d.ts.map