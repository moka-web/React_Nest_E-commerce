import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import { Category } from 'src/database/entities/category.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findCategoryById(categoryId: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: {
        id: categoryId,
      },
    });
  }

  async findOneById(productId: number): Promise<Product | null> {
    return this.productRepository.findOne({
      where: {
        id: productId,
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByIdWithCategory(productId: number): Promise<Product | null> {
    return this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations: ['category'],
    });
  }

  async createProduct(
    category: Category,
    merchantId: number,
    data?: Record<string, any>,
  ): Promise<Product> {
    // H4: Incluir todos los datos del DTO al crear el producto
    const product = this.productRepository.create({
      category,
      merchantId,
      ...data, // H4: Spread de datos adicionales del DTO
    });
    return this.productRepository.save(product);
  }

  async updateProduct(
    productId: number,
    merchantId: number,
    data: Record<string, any>,
  ): Promise<any> {
    const result = await this.productRepository
      .createQueryBuilder()
      .update<Product>(Product)
      .set(data)
      .where('id = :id', { id: productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .returning(['id'])
      .execute();
    return result.raw[0];
  }

  async activateProduct(productId: number, merchantId: number): Promise<any> {
    const result = await this.productRepository
      .createQueryBuilder()
      .update<Product>(Product)
      .set({ isActive: true })
      .where('id = :id', { id: productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .returning(['id', 'isActive'])
      .execute();
    return result.raw[0];
  }

  async deleteProduct(
    productId: number,
    merchantId: number,
  ): Promise<DeleteResult> {
    return this.productRepository
      .createQueryBuilder()
      .delete()
      .from(Product)
      .where('id = :productId', { productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .execute();
  }
}
