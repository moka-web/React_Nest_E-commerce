import { Expose } from 'class-transformer';
// H2: Imports para validación de password
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  // H2: Validación mínima de password
  // - MinLength(8): mínimo 8 caracteres
  // - Matches: al menos 1 mayúscula, 1 minúscula, 1 número
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least 1 uppercase, 1 lowercase, and 1 number',
  })
  public password: string;
}

export class UserDto {
  @Expose()
  public id: number;

  @Expose()
  public email: string;
}
