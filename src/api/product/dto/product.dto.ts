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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { variationTypesKeys } from 'src/database/entities/product.entity';
import { ProductDetails, ProductDetailsTypeFn } from './productDetails';

export class CreateProductDto {
  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsNumber()
  @IsNotEmpty()
  public categoryId: number;

  // H4: Campos opcionales que pueden pasarse al crear el producto
  @ApiPropertyOptional({ example: 'Laptop', description: 'Product name' })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiPropertyOptional({
    example: 'ABC123',
    description: 'Product code (UPC/EAN)',
  })
  @IsOptional()
  @IsString()
  public code?: string;

  @ApiPropertyOptional({
    example: 'High-performance laptop',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiPropertyOptional({ example: 'Dell XPS 15', description: 'Product title' })
  @IsOptional()
  @IsString()
  public title?: string;

  @ApiPropertyOptional({
    example: 'NONE',
    enum: ['NONE', 'OnlyOneSize', 'OnlyColor', 'SizeAndColor'],
    description: 'Variation type',
  })
  @IsOptional()
  @IsIn(variationTypesKeys)
  public variationType?: string;
}

export class ProductDetailsDto {
  @ApiProperty({ example: 'Dell XPS 15', description: 'Product title' })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ example: 'ABC123456', description: 'Product code' })
  @IsString()
  @IsNotEmpty()
  public code: string;

  @ApiProperty({
    example: 'NONE',
    enum: ['NONE', 'OnlyOneSize', 'OnlyColor', 'SizeAndColor'],
    description: 'Variation type',
  })
  @IsDefined()
  @IsString()
  @IsIn(variationTypesKeys)
  public variationType: string;

  @ApiProperty({ description: 'Product details based on category' })
  @IsDefined()
  @Type(ProductDetailsTypeFn)
  @ValidateNested()
  public details: ProductDetails;

  @ApiProperty({
    example: ['Fast processor', 'Long battery life'],
    description: 'Product features',
  })
  @ArrayMinSize(1)
  @IsString({ each: true })
  public about: string[];

  @ApiProperty({
    example: 'High-performance laptop with OLED display',
    description: 'Product description',
  })
  @IsString()
  @IsNotEmpty()
  public description: string;
}
