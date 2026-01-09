import 'reflect-metadata';
import { ReferralService } from '../../src/services/referral.service';
import { BaseRepository } from '../../src/repositories/BaseRepository';
import User from '../../src/models/User.model'; // Still needed for type inference
import Referral from '../../src/models/Referral.model';
import Commission from '../../src/models/Commission.model';
import { container } from 'tsyringe';
import mongoose from 'mongoose';
import { NotFoundError } from '../../src/utils/errors'; // Import NotFoundError

// Mock the BaseRepository for User
const mockUserRepository = {
  findById: jest.fn(),
  updateById: jest.fn(),
  findOne: jest.fn(),
} as unknown as BaseRepository<any>;

// Mock Mongoose models - these are directly used in the service for find and create
jest.mock('../../src/models/User.model', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock('../../src/models/Referral.model', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../../src/models/Commission.model', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    create: jest.fn(),
  },
}));

describe('ReferralService', () => {
  let referralService: ReferralService;

  beforeAll(() => {
    // Register mock UserRepository with tsyringe container
    container.register('UserRepository', { useValue: mockUserRepository });
  });

  beforeEach(() => {
    referralService = container.resolve(ReferralService);
    jest.clearAllMocks();
  });

  describe('generateReferralCode', () => {
    it('should generate a new referral code if one does not exist', async () => {
      const mockUserId = new mongoose.Types.ObjectId();
      const mockUser = { _id: mockUserId, referralCode: undefined };

      (mockUserRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (mockUserRepository.updateById as jest.Mock).mockResolvedValue({ ...mockUser, referralCode: 'NEWCODE1' });

      const code = await referralService.generateReferralCode(mockUserId.toString());

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId.toString());
      expect(mockUserRepository.updateById).toHaveBeenCalledWith(
        mockUserId.toString(),
        expect.objectContaining({ referralCode: expect.any(String) })
      );
      expect(code).toBeDefined();
      expect(typeof code).toBe('string');
      expect(code.length).toBe(8); // Default length
    });

    it('should return existing referral code if one exists', async () => {
      const mockUserId = new mongoose.Types.ObjectId();
      const existingCode = 'EXISTING';
      const mockUser = { _id: mockUserId, referralCode: existingCode };

      (mockUserRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      const code = await referralService.generateReferralCode(mockUserId.toString());

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId.toString());
      expect(mockUserRepository.updateById).not.toHaveBeenCalled();
      expect(code).toBe(existingCode);
    });

    it('should throw NotFoundError if user does not exist', async () => {
      const mockUserId = new mongoose.Types.ObjectId();
      (mockUserRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(referralService.generateReferralCode(mockUserId.toString())).rejects.toThrow(NotFoundError);
    });
  });

  describe('getReferralDashboard', () => {
    it('should return referral dashboard data', async () => {
      const mockUserId = new mongoose.Types.ObjectId();
      const mockReferredUser = { _id: new mongoose.Types.ObjectId(), name: 'Referred User', email: 'referred@test.com', createdAt: new Date() };
      const mockReferredUsers = [{ _id: new mongoose.Types.ObjectId(), referred: mockReferredUser, status: 'registered' }];
      const mockCommissions = [
        { _id: new mongoose.Types.ObjectId(), amount: 10, commissionRate: 0.2, createdAt: new Date() },
        { _id: new mongoose.Types.ObjectId(), amount: 15, commissionRate: 0.2, createdAt: new Date() },
      ];

      (Referral.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockReferredUsers),
      });
      (Commission.find as jest.Mock).mockResolvedValue(mockCommissions);

      const dashboardData = await referralService.getReferralDashboard(mockUserId.toString());

      expect(Referral.find).toHaveBeenCalled();
      const findQuery = (Referral.find as jest.Mock).mock.calls[0][0];
      expect(findQuery.referrer.toString()).toEqual(mockUserId.toString());
      
      expect(Commission.find).toHaveBeenCalledWith({ referrer: mockUserId.toString() });
      expect(dashboardData.referredUsers).toEqual(mockReferredUsers);
      expect(dashboardData.commissions).toEqual(mockCommissions);
      expect(dashboardData.totalEarnings).toBe(25);
    });
  });
});