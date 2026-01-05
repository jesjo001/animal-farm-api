import { singleton, inject } from 'tsyringe';
import bcrypt from 'bcryptjs';
import Tenant from '../models/Tenant.model';
import User from '../models/User.model';
import { BaseRepository } from '../repositories/BaseRepository';
import { signJWT, signRefreshJWT } from '../utils/jwt.util';
import { hashPassword, comparePassword } from '../utils/password.util';
import { RegisterDTO, LoginDTO, JWTPayload } from '../types';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';

@singleton()
export class AuthService {
  constructor(
    @inject('TenantRepository') private tenantRepository: BaseRepository<any>,
    @inject('UserRepository') private userRepository: BaseRepository<any>
  ) {}

  async register(data: RegisterDTO): Promise<{ tenant: any; user: any; tokens: any }> {
    // Check if tenant with email already exists
    const existingTenant = await this.tenantRepository.findOne({ email: data.email });
    if (existingTenant) {
      throw new ConflictError('Farm with this email already exists');
    }

    // Create tenant
    const tenant = await this.tenantRepository.create({
      name: data.farmName,
      ownerName: data.ownerName,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });

    // Create admin user for the tenant
    const hashedPassword = await hashPassword(data.password);
    const user = await this.userRepository.create({
      tenantId: tenant._id,
      name: data.ownerName,
      email: data.email,
      password: hashedPassword,
      role: 'tenant_admin',
    });

    // Generate tokens
    const payload: JWTPayload = {
      userId: user._id.toString(),
      tenantId: tenant._id.toString(),
      role: user.role,
      email: user.email,
    };

    const tokens = {
      accessToken: signJWT(payload),
      refreshToken: signRefreshJWT(payload),
    };

    return { tenant, user, tokens };
  }

  async login(data: LoginDTO): Promise<{ user: any; tokens: any }> {
    // Find user
    const user = await this.userRepository.findOne({ email: data.email });
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Update last login
    await this.userRepository.updateById(user._id, { lastLogin: new Date() });

    // Generate tokens
    const payload: JWTPayload = {
      userId: user._id.toString(),
      tenantId: user.tenantId.toString(),
      role: user.role,
      email: user.email,
    };

    const tokens = {
      accessToken: signJWT(payload),
      refreshToken: signRefreshJWT(payload),
    };

    return { user, tokens };
  }

  async getUserById(userId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateUser(userId: string, data: any): Promise<any> {
    const user = await this.getUserById(userId);
    const updatedUser = await this.userRepository.updateById(userId, data);
    return updatedUser;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.getUserById(userId);

    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.userRepository.updateById(userId, { password: hashedPassword });
  }
}