import { Schema, Document } from 'mongoose';
export interface ITrainingSample extends Document {
    tenantId: Schema.Types.ObjectId;
    sex: 'male' | 'female';
    validatedSex?: 'male' | 'female';
    isValidated: boolean;
    features: any;
    audioUrl: string;
}
export declare const TrainingSampleModel: import("mongoose").Model<ITrainingSample, {}, {}, {}, Document<unknown, {}, ITrainingSample, {}, {}> & ITrainingSample & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TrainingSample.model.d.ts.map