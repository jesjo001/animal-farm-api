import { BaseRepository } from '../repositories/BaseRepository';
import { RegisterDTO, LoginDTO } from '../types';
export declare class AuthService {
    private tenantRepository;
    private userRepository;
    constructor(tenantRepository: BaseRepository<any>, userRepository: BaseRepository<any>);
    register(data: RegisterDTO): Promise<{
        tenant: any;
        user: any;
        tokens: any;
    }>;
    login(data: LoginDTO): Promise<{
        user: any;
        tokens: any;
    }>;
    getUserById(userId: string): Promise<any>;
    getUsersByTenant(tenantId: string): Promise<any[]>;
    createUser(data: any): Promise<any>;
    updateUser(userId: string, data: any): Promise<any>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    refreshToken(token: string): Promise<string>;
}
//# sourceMappingURL=auth.service.d.ts.map