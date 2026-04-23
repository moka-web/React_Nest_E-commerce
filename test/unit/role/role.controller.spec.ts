import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from '../../../src/api/role/controllers/role.controller';
import { RoleService } from '../../../src/api/role/services/role.service';
import { AuthGuard } from '../../../src/api/auth/guards/auth.guard';
import { RolesGuard } from '../../../src/api/auth/guards/roles.guard';
import { mockGuard } from '../../mocks/guards';

describe('RoleController', () => {
  let controller: RoleController;
  let fakeRoleService: Partial<RoleService>;

  beforeEach(async () => {
    fakeRoleService = {
      assignRoleToUser: jest.fn().mockResolvedValue({ id: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: fakeRoleService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('assignRoleToUser', () => {
    it('should call roleService.assignRoleToUser', async () => {
      const body = { userId: 1, roleId: 2 };
      const result = await controller.assignRoleToUser(body);

      expect(fakeRoleService.assignRoleToUser).toBeCalledWith(body);
      expect(result).toHaveProperty('id');
    });
  });
});
