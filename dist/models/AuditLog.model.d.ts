import mongoose, { Document } from 'mongoose';
export interface IAuditLog extends Document {
    _id: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    action: string;
    resource: string;
    resourceId?: mongoose.Types.ObjectId;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}
declare const AuditLog: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, {}> & IAuditLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default AuditLog;
//# sourceMappingURL=AuditLog.model.d.ts.map