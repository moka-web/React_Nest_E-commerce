import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { User } from '../../database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from '../role/role.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
// M2: UserService importado pero no usado - ya viene de UserModule

@Module({
  imports: [
    UserModule, // M2: UserService ya está exportado desde UserModule
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3h' },
    }),
    RoleModule,
  ],
  controllers: [AuthController],
  // M2: Removido UserService de providers - ya está en UserModule
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
