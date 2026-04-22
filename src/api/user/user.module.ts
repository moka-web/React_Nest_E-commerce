import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { EventEmitter } from '../../core/event-emitter.service';
import { UserRegisteredConsumer } from './consumers/user-registered.consumer';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    EventEmitter,
    UserRegisteredConsumer,
  ],
  exports: [UserService, UserRepository],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
