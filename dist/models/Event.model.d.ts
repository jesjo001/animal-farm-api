import mongoose, { Document } from 'mongoose';
export interface IEvent extends Document {
    _id: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    eventType: 'birth' | 'death' | 'vet_visit' | 'vaccination' | 'other';
    date: Date;
    animalId?: mongoose.Types.ObjectId;
    count?: number;
    description?: string;
    cost?: number;
    recordedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Event: mongoose.Model<IEvent, {}, {}, {}, mongoose.Document<unknown, {}, IEvent, {}, {}> & IEvent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Event;
//# sourceMappingURL=Event.model.d.ts.map