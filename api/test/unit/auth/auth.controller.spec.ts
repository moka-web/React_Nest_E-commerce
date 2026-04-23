import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from '../../../src/api/auth/services/auth.service';
import { AuthController } from '../../../src/api/auth/controllers/auth.controller';
import { mockGuard } from '../../mocks/guards';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      register: jest.fn().mockResolvedValue({ message: 'success' }),
      login: jest.fn().mockResolvedValue({ accessToken: 'fake-token' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return accessToken', async () => {
      const result = await controller.login({
        email: 'test@test.com',
        password: 'password123',
      });
      expect(result).toHaveProperty('accessToken');
      expect(fakeAuthService.login).toBeCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });
  });

  describe('register', () => {
    it('should return success message', async () => {
      const result = await controller.register({
        email: 'new@test.com',
        password: 'password123',
      });
      expect(result).toEqual({ message: 'success' });
      expect(fakeAuthService.register).toBeCalledWith({
        email: 'new@test.com',
        password: 'password123',
      });
    });
  });
});
