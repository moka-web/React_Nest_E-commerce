import { Injectable, NotFoundException } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { User } from 'src/database/entities/user.entity';
import { CreateUserDto } from '../dto/user.dto';
import { Role } from 'src/database/entities/role.entity';
import { UserRelation } from '../dto/user.types';
import { errorMessages } from 'src/errors/custom';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(
    body: CreateUserDto,
    ...roles: Role[]
  ): Promise<User> {
    const hashedPassword = await hash(body.password, 10);
    return this.userRepository.createAndSave({
      ...body,
      password: hashedPassword,
      roles,
    });
  }

  public async findByEmail(
    email: string,
    relations?: UserRelation,
  ): Promise<User | null> {
    return this.userRepository.findOneByEmail(email, relations);
  }

  public async comparePassword(password, userPassword): Promise<boolean> {
    return compare(password, userPassword);
  }

  public async findById(id: number, relations?: UserRelation): Promise<User> {
    const user = await this.userRepository.findOneById(id, relations);
    if (!user) {
      throw new NotFoundException(errorMessages.user.notFound);
    }
    return user;
  }

  public async save(user: User) {
    return this.userRepository.save(user);
  }
}
