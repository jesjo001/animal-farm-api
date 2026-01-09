import { singleton, inject } from 'tsyringe';
import { BaseRepository } from '../repositories/BaseRepository';
import { NotFoundError } from '../utils/errors';
import { IUser } from '../models/User.model';
import Referral from '../models/Referral.model';
import Commission from '../models/Commission.model';

@singleton()
export class ReferralService {
  constructor(
    @inject('UserRepository') private userRepository: BaseRepository<IUser>
  ) {}

  async generateReferralCode(userId: string): Promise<string> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.referralCode) {
      return user.referralCode;
    }

    const code = this.generateCode();
    await this.userRepository.updateById(userId, { referralCode: code });
    return code;
  }

  async getReferralDashboard(userId: string) {
    const referredUsers = await Referral.find({ referrer: userId }).populate('referred', 'name email createdAt');
    const commissions = await Commission.find({ referrer: userId });

    const totalEarnings = commissions.reduce((acc, commission) => acc + commission.amount, 0);

    return {
      referredUsers,
      totalEarnings,
      commissions,
    };
  }

  private generateCode(length = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
