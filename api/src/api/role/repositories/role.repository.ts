import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/database/entities/role.entity';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async findOneById(roleId: number): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: {
        id: roleId,
      },
    });
  }

  async findOneByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: {
        name,
      },
    });
  }
}
