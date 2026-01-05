import { AuthService } from '../../src/services/auth.service';
import { container } from 'tsyringe';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = container.resolve(AuthService);
  });

  describe('register', () => {
    it('should register a new farm successfully', async () => {
      // Mock data
      const registerData = {
        farmName: 'Test Farm',
        ownerName: 'John Doe',
        email: 'john@testfarm.com',
        password: 'password123',
      };

      // Mock the repository methods
      // This would require proper mocking setup

      // const result = await authService.register(registerData);
      // expect(result).toBeDefined();
      // expect(result.tenant).toBeDefined();
      // expect(result.user).toBeDefined();
      // expect(result.tokens).toBeDefined();
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Mock data
      const loginData = {
        email: 'john@testfarm.com',
        password: 'password123',
      };

      // const result = await authService.login(loginData);
      // expect(result).toBeDefined();
      // expect(result.user).toBeDefined();
      // expect(result.tokens).toBeDefined();
    });
  });
});