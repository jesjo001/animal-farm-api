import mongoose, { Document } from 'mongoose';
export interface IProduction extends Document {
    _id: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    date: Date;
    totalEggs: number;
    gradeBreakdown: {
        gradeA: number;
        gradeB: number;
        gradeC: number;
        broken: number;
    };
    notes?: string;
    recordedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Production: mongoose.Model<IProduction, {}, {}, {}, mongoose.Document<unknown, {}, IProduction, {}, {}> & IProduction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Production;
//# sourceMappingURL=Production.model.d.ts.map