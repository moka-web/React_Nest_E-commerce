import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { variationTypesKeys } from 'src/database/entities/product.entity';
import { ProductDetails, ProductDetailsTypeFn } from './productDetails';

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  public categoryId: number;

  // H4: Campos opcionales que pueden pasarse al crear el producto
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsString()
  public code?: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString()
  public title?: string;

  @IsOptional()
  @IsIn(variationTypesKeys)
  public variationType?: string;
}

export class ProductDetailsDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public code: string;

  @IsDefined()
  @IsString()
  @IsIn(variationTypesKeys)
  public variationType: string;

  @IsDefined()
  @Type(ProductDetailsTypeFn)
  @ValidateNested()
  public details: ProductDetails;

  @ArrayMinSize(1)
  @IsString({ each: true })
  public about: string[];

  @IsString()
  @IsNotEmpty()
  public description: string;
}
