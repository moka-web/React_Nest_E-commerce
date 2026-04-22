import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { Category } from '../../database/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Product } from 'src/database/entities/product.entity';

@Module({
  // M3: Removido User de TypeOrmModule - no es necesario
  // La relación con User se maneja a través de Product entity
  imports: [TypeOrmModule.forFeature([Product, Category]), UserModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
