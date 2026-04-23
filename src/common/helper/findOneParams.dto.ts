// M1: Cambiado de IsNumberString a IsNumber para consistencia
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneParams {
  @ApiProperty({ type: 'number', description: 'Entity ID' })
  @IsNumber()
  id: number;
}
