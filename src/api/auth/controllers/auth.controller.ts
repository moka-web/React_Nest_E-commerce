import { Body, Controller, Post, UseGuards } from '@nestjs/common';
// H1: Importar ThrottlerGuard para rate limiting
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateUserDto } from 'src/api/user/dto/user.dto';
import { AuthService } from '../services/auth.service';

// H1: Aplicar rate limiting a todo el controlador de auth
// Protege contra brute force en login y register
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() user: CreateUserDto) {
    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }
}
