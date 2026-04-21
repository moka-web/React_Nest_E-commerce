import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'src/database/entities/role.entity';
import { AssignRoleDto } from '../dto/role.dto';
import { UserService } from 'src/api/user/services/user.service';
import { errorMessages } from 'src/errors/custom';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userService: UserService,
  ) {}

  async assignRoleToUser(data: AssignRoleDto) {
    const role = await this.findById(data.roleId);
    const user = await this.userService.findById(data.userId, { roles: true });
    if (!user.roles.some((userRole) => userRole.id === data.roleId)) {
      user.roles.push(role);
    }
    return this.userService.save(user);
  }

  async findById(roleId: number) {
    const role = await this.roleRepository.findOneById(roleId);
    if (!role) {
      throw new NotFoundException(errorMessages.role.notFound);
    }
    return role;
  }
}
