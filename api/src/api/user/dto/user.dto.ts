import { Expose } from 'class-transformer';
// H2: Imports para validación de password
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'Password with min 8 chars, 1 uppercase, 1 lowercase, 1 number',
  })
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

  @ApiPropertyOptional({
    example: 'Customer',
    description: 'User role: Customer or Merchant',
    required: false,
  })
  @IsOptional()
  @IsString()
  public role?: string;
}

export class UserDto {
  @Expose()
  @ApiProperty()
  public id: number;

  @Expose()
  @ApiProperty()
  public email: string;
}
