import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../../src/database/entities/role.entity';
import { User } from '../../../src/database/entities/user.entity';
import { RoleService } from '../../../src/api/role/services/role.service';
import { RoleRepository } from '../../../src/api/role/repositories/role.repository';
import { UserService } from '../../../src/api/user/services/user.service';
import { UserRepository as UserRepo } from '../../../src/api/user/repositories/user.repository';
import { errorMessages } from '../../../src/errors/custom';

describe('RoleService', () => {
  let service: RoleService;
  let fakeRoleRepository: Partial<RoleRepository>;
  let fakeUserService: Partial<UserService>;
  const role = { id: 1, name: 'Customer' } as Role;
  const userWithRoles = { id: 1, email: 'test@test.com', roles: [] } as User;

  beforeEach(async () => {
    jest.clearAllMocks();
    fakeRoleRepository = {
      findOneById: jest.fn().mockResolvedValue(role),
    };
    fakeUserService = {
      findById: jest.fn().mockResolvedValue(userWithRoles),
      save: jest.fn().mockImplementation((u) => Promise.resolve(u)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: fakeRoleRepository,
        },
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return role when found', async () => {
      const result = await service.findById(1);
      expect(fakeRoleRepository.findOneById).toBeCalledWith(1);
      expect(result.id).toBe(role.id);
    });

    it('should throw error if not found', async () => {
      fakeRoleRepository.findOneById = jest.fn().mockResolvedValue(null);
      const result = service.findById(1);

      expect(fakeRoleRepository.findOneById).toBeCalledWith(1);
      expect(result).rejects.toThrowError(errorMessages.role.notFound.message);
    });
  });

  describe('assignRoleToUser', () => {
    it('should assign role and save user', async () => {
      const result = await service.assignRoleToUser({ userId: 1, roleId: 1 });
      expect(fakeUserService.findById).toBeCalledWith(1, { roles: true });
      expect(fakeUserService.save).toBeCalled();
      expect(result).toBeDefined();
    });
  });
});
