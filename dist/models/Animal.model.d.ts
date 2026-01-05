import mongoose, { Document } from 'mongoose';
export interface IAnimal extends Document {
    _id: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    tagNumber: string;
    breed: string;
    type: string;
    birthDate: Date;
    gender: 'male' | 'female';
    location?: string;
    healthStatus: 'healthy' | 'sick' | 'injured' | 'deceased';
    weight?: number;
    weightHistory: Array<{
        weight: number;
        date: Date;
        measuredBy: mongoose.Types.ObjectId;
    }>;
    notes?: string;
    isActive: boolean;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Animal: mongoose.Model<IAnimal, {}, {}, {}, mongoose.Document<unknown, {}, IAnimal, {}, {}> & IAnimal & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Animal;
//# sourceMappingURL=Animal.model.d.ts.map