import { Schema, Document } from 'mongoose';
export interface IChickSexingResult extends Document {
    tenantId: Schema.Types.ObjectId;
    batchId: Schema.Types.ObjectId;
    chickNumber: number;
    audioUrl: string;
    audioDuration: number;
    predictedSex: 'male' | 'female';
    confidence: number;
    status: 'success' | 'low_confidence' | 'failed';
    analysisMetadata: any;
    mlModelVersion: string;
}
export declare const ChickSexingResultModel: import("mongoose").Model<IChickSexingResult, {}, {}, {}, Document<unknown, {}, IChickSexingResult, {}, {}> & IChickSexingResult & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ChickSexingResult.model.d.ts.map