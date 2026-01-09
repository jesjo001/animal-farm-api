import { BaseRepository } from '../repositories/BaseRepository';
import { IUser } from '../models/User.model';
export declare class ReferralService {
    private userRepository;
    constructor(userRepository: BaseRepository<IUser>);
    generateReferralCode(userId: string): Promise<string>;
    getReferralDashboard(userId: string): Promise<{
        referredUsers: (import("mongoose").Document<unknown, {}, import("../models/Referral.model").IReferral, {}, {}> & import("../models/Referral.model").IReferral & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        totalEarnings: number;
        commissions: (import("mongoose").Document<unknown, {}, import("../models/Commission.model").ICommission, {}, {}> & import("../models/Commission.model").ICommission & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    private generateCode;
}
//# sourceMappingURL=referral.service.d.ts.map