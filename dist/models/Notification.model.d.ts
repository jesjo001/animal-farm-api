import mongoose, { Document } from 'mongoose';
export interface INotification extends Document {
    _id: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    isRead: boolean;
    relatedEntity?: {
        type: 'animal' | 'production' | 'event' | 'transaction' | 'feed';
        id: mongoose.Types.ObjectId;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Notification;
//# sourceMappingURL=Notification.model.d.ts.map