import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// H3: PayloadDto extendido para incluir roles en el JWT
// Esto evita hacer lookup a la DB en cada request
export class PayloadDto {
  @IsNotEmpty()
  @IsNumber()
  public id: number;

  @IsNotEmpty()
  @IsString()
  public email: string;

  // H3: Roles incluidos en el token para evitar DB lookup
  @IsNotEmpty()
  public roles: { id: number; name: string }[];
}
