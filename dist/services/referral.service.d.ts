import { BaseRepository } from '../repositories/BaseRepository';
import { IUser } from '../models/User.model';
export declare class ReferralService {
    private userRepository;
    constructor(userRepository: BaseRepository<IUser>);
    generateReferralCode(userId: string): Promise<string>;
    getReferralDashboard(userId: string): Promise<{
        referredUsers: any[];
        totalEarnings: any;
        commissions: any[];
    }>;
    private generateCode;
}
//# sourceMappingURL=referral.service.d.ts.map