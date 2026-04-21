import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, ProductDetailsDto } from '../dto/product.dto';
import { Category } from 'src/database/entities/category.entity';
import { Product } from 'src/database/entities/product.entity';
import { errorMessages } from 'src/errors/custom';
import { validate } from 'class-validator';
import { successObject } from 'src/common/helper/sucess-response.interceptor';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProduct(productId: number) {
    const product = await this.productRepository.findOneById(productId);

    if (!product) throw new NotFoundException(errorMessages.product.notFound);

    return product;
  }

  async createProduct(data: CreateProductDto, merchantId: number) {
    const category = await this.productRepository.findCategoryById(
      data.categoryId,
    );

    if (!category) throw new NotFoundException(errorMessages.category.notFound);

    return this.productRepository.createProduct(category, merchantId);
  }

  async addProductDetails(
    productId: number,
    body: ProductDetailsDto,
    merchantId: number,
  ) {
    const result = await this.productRepository.updateProduct(
      productId,
      merchantId,
      body,
    );
    if (!result) throw new NotFoundException(errorMessages.product.notFound);
    return result;
  }

  async activateProduct(productId: number, merchantId: number) {
    if (!(await this.validate(productId)))
      throw new ConflictException(errorMessages.product.notFulfilled);

    return this.productRepository.activateProduct(productId, merchantId);
  }

  async validate(productId: number) {
    const product = await this.productRepository.findOneById(productId);
    if (!product) throw new NotFoundException(errorMessages.product.notFound);
    const errors = await validate(product);

    if (errors.length > 0) return false;

    return true;
  }

  async deleteProduct(productId: number, merchantId: number) {
    const result = await this.productRepository.deleteProduct(
      productId,
      merchantId,
    );

    if (result.affected < 1)
      throw new NotFoundException(errorMessages.product.notFound);

    return successObject;
  }
}
