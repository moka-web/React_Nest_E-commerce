// M1: Cambiado de IsNumberString a IsNumber para consistencia
import { IsNumber } from 'class-validator';

export class FindOneParams {
  @IsNumber()
  id: number;
}
