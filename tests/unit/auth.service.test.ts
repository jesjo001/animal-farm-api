import 'reflect-metadata';
import { AuthService } from '../../src/services/auth.service';
import { BaseRepository } from '../../src/repositories/BaseRepository';
import { ConflictError, UnauthorizedError } from '../../src/utils/errors';
import mongoose from 'mongoose';

// Mock the repositories
const mockTenantRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
} as unknown as BaseRepository<any>;

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  updateById: jest.fn(),
} as unknown as BaseRepository<any>;

// Mock password utils
jest.mock('../../src/utils/password.util', () => ({
  ...jest.requireActual('../../src/utils/password.util'),
  comparePassword: jest.fn().mockResolvedValue(true),
  hashPassword: jest.fn().mockResolvedValue('hashedpassword'),
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    // Manually create instance
    authService = new AuthService(mockTenantRepository, mockUserRepository);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new farm successfully', async () => {
      const registerData = {
        farmName: 'Test Farm',
        ownerName: 'John Doe',
        email: 'john@testfarm.com',
        password: 'password123',
      };
      
      const tenantId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();

      (mockTenantRepository.findOne as jest.Mock).mockResolvedValue(null);
      (mockTenantRepository.create as jest.Mock).mockResolvedValue({ _id: tenantId, ...registerData });
      (mockUserRepository.create as jest.Mock).mockResolvedValue({ _id: userId, email: registerData.email, role: 'tenant_admin' });

      const result = await authService.register(registerData);
      
      expect(result).toBeDefined();
      expect(result.tenant).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(mockTenantRepository.findOne).toHaveBeenCalledWith({ email: registerData.email });
      expect(mockTenantRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictError if farm with email already exists', async () => {
      const registerData = {
        farmName: 'Test Farm',
        ownerName: 'John Doe',
        email: 'john@testfarm.com',
        password: 'password123',
      };

      (mockTenantRepository.findOne as jest.Mock).mockResolvedValue({ email: registerData.email });

      await expect(authService.register(registerData)).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'john@testfarm.com',
        password: 'password123',
      };
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        tenantId: new mongoose.Types.ObjectId(),
        email: loginData.email,
        password: 'hashedpassword',
        isActive: true,
        role: 'tenant_admin',
      };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await authService.login(loginData);
      
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: loginData.email });
      expect(mockUserRepository.updateById).toHaveBeenCalledWith(mockUser._id, { lastLogin: expect.any(Date) });
    });

    it('should throw UnauthorizedError for invalid credentials', async () => {
        const loginData = {
          email: 'john@testfarm.com',
          password: 'wrongpassword',
        };
  
        (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);
  
        await expect(authService.login(loginData)).rejects.toThrow(UnauthorizedError);
      });
  });
});