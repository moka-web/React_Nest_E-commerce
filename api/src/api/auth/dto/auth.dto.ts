import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// H3: PayloadDto extendido para incluir roles en el JWT
// Esto evita hacer lookup a la DB en cada request
export class PayloadDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public email: string;

  // H3: Roles incluidos en el token para evitar DB lookup
  @ApiProperty()
  @IsNotEmpty()
  public roles: { id: number; name: string }[];
}
