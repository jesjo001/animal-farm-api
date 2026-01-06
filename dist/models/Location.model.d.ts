import { Document, Types } from 'mongoose';
export interface ILocation extends Document {
    tenantId: Types.ObjectId;
    name: string;
    type: 'barn' | 'pen' | 'field' | 'coop' | 'stable';
    capacity: number;
    description?: string;
}
export declare const Location: import("mongoose").Model<ILocation, {}, {}, {}, Document<unknown, {}, ILocation, {}, {}> & ILocation & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Location.model.d.ts.map