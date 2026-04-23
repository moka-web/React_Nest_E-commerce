import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { UserRelation } from '../dto/user.types';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(
    email: string,
    relations?: UserRelation,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations,
    });
  }

  async findOneById(
    id: number,
    relations?: UserRelation,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations,
    });
  }

  async createAndSave(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
