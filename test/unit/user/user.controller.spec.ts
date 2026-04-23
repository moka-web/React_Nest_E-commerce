import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/api/user/controllers/user.controller';
import { UserService } from '../../../src/api/user/services/user.service';
import { User } from '../../../src/database/entities/user.entity';
import { AuthGuard } from '../../../src/api/auth/guards/auth.guard';
import { mockGuard } from '../../mocks/guards';

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  const mockUser = { id: 1, email: 'test@test.com' } as User;

  beforeEach(async () => {
    fakeUserService = {
      findById: jest.fn().mockResolvedValue(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('profile', () => {
    it('should return user data', async () => {
      const result = await controller.profile(mockUser);

      expect(fakeUserService.findById).toBeCalledWith(mockUser.id);
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
    });
  });
});
