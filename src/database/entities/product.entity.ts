import { Type } from 'class-transformer';
// H5: REMOVIDOS - Los decoradores de validación NO belongen en entidades
// La validación debe estar en los DTOs, no en las entidades de base de datos
import {
  ProductDetails,
  ProductDetailsTypeFn,
} from 'src/api/product/dto/productDetails';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  public id!: number;

  // H5: nullable: true con @IsDefined() es contradictorio
  // Los decoradores de validación se eliminan - van en DTOs
  @Column({ type: 'varchar', nullable: true })
  @Index()
  public code: string | null;

  @Column({ type: 'varchar', nullable: true })
  public title: string | null;

  @Column({ type: 'varchar', nullable: true })
  public variationType: string | null;

  @Column({ type: 'text', nullable: true })
  public description: string | null;

  @Column({ type: 'text', array: true, default: [] })
  public about: string[];

  @Column({ type: 'jsonb', nullable: true })
  @Type(ProductDetailsTypeFn)
  public details: Partial<ProductDetails> | null;

  @Column({ default: false })
  public isActive: boolean;

  @Column({ type: 'int', nullable: true })
  public merchantId: number | null;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'merchantId' })
  public merchant: User;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  public category: Category;

  @Column({ type: 'int', nullable: true })
  public categoryId: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}

export enum VariationTypes {
  NONE = 'NONE',
  // L1: Normalizado - OnlySize -> OnlyOneSize (consistent naming)
  OnlyOneSize = 'OnlyOneSize',
  OnlyColor = 'OnlyColor',
  SizeAndColor = 'SizeAndColor',
}
export const variationTypesKeys = Object.keys(VariationTypes);
