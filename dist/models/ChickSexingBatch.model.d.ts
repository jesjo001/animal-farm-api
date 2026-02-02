import { Schema, Document } from 'mongoose';
export interface IChickSexingBatch extends Document {
    tenantId: Schema.Types.ObjectId;
    name: string;
    totalAnalyzed: number;
    maleCount: number;
    femaleCount: number;
    averageConfidence: number;
    status: 'processing' | 'completed' | 'failed';
    createdBy: Schema.Types.ObjectId;
}
export declare const ChickSexingBatchModel: import("mongoose").Model<IChickSexingBatch, {}, {}, {}, Document<unknown, {}, IChickSexingBatch, {}, {}> & IChickSexingBatch & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ChickSexingBatch.model.d.ts.map