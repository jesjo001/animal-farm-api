import { Schema, Document } from 'mongoose';
export interface ITrainingRun extends Document {
    tenantId: Schema.Types.ObjectId;
    versionId: string;
    trainingSamples: {
        maleCount: number;
        femaleCount: number;
        totalDuration: number;
        averageQuality: number;
        sampleIds: Schema.Types.ObjectId[];
    };
    status: 'training' | 'completed' | 'failed';
    currentEpoch: number;
    totalEpochs: number;
    initiatedBy: Schema.Types.ObjectId;
    startTime: Date;
    endTime?: Date;
    finalMetrics?: any;
    epochMetrics?: any[];
    errorMessage?: string;
}
export declare const TrainingRunModel: import("mongoose").Model<ITrainingRun, {}, {}, {}, Document<unknown, {}, ITrainingRun, {}, {}> & ITrainingRun & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TrainingRun.model.d.ts.map