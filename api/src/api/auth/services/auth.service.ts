import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from 'src/api/role/services/role.service';
import { CreateUserDto } from 'src/api/user/dto/user.dto';
import { UserService } from 'src/api/user/services/user.service';
import { errorMessages } from 'src/errors/custom';
import { PayloadDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(user: CreateUserDto) {
    const { email, password } = user;
    // H3: Cargar usuario con roles para incluir en el token
    const alreadyExistingUser = await this.userService.findByEmail(email, {
      roles: true,
    });
    if (!alreadyExistingUser)
      throw new UnauthorizedException(errorMessages.auth.wrongCredentials);

    const isValidPassword = await this.userService.comparePassword(
      password,
      alreadyExistingUser.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException(errorMessages.auth.wrongCredentials);

    // H3: Incluir roles en el token para evitar DB lookup en cada request
    return this.generateToken({
      id: alreadyExistingUser.id,
      email,
      roles: alreadyExistingUser.roles.map((role) => ({
        id: role.id,
        name: role.name,
      })),
    });
  }

  async register(user: CreateUserDto) {
    const alreadyExistingUser = await this.userService.findByEmail(user.email);
    if (alreadyExistingUser)
      throw new ConflictException(errorMessages.auth.userAlreadyExist);

    // Asignar rol según selección (Merchant o Customer, no Admin)
    const roleName = user.role === 'Merchant' ? 'Merchant' : 'Customer';
    const role = await this.roleService.findByName(roleName);

    await this.userService.createUser(user, role);

    return {
      message: 'success',
    };
  }

  async generateToken(payload: PayloadDto) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.secret'),
    });

    return { accessToken };
  }
}
