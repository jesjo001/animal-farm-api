import { Schema, Document } from 'mongoose';
export interface ILocation extends Document {
    tenantId: Schema.Types.ObjectId;
    name: string;
    type: 'barn' | 'pen' | 'field' | 'coop' | 'stable';
    capacity: number;
    description?: string;
}
export declare const Location: import("mongoose").Model<ILocation, {}, {}, {}, Document<unknown, {}, ILocation, {}, {}> & ILocation & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Location.model.d.ts.map