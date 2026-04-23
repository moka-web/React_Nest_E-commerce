import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'int' })
  public userId: number;

  @Column({ type: 'varchar', length: 20 })
  public status: OrderStatus;

  @Column({ type: 'int' })
  public productVariationId: number;

  @Column({ type: 'varchar', length: 7 })
  public countryCode: string;

  @Column({ type: 'int' })
  public quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
