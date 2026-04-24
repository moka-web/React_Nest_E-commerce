import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  WELCOME = 'WELCOME',
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  PRODUCT_CREATED = 'PRODUCT_CREATED',
  SYSTEM = 'SYSTEM',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'int' })
  public userId: number;

  @ManyToOne(() => User)
  public user: User;

  @Column({
    type: 'varchar',
    length: 50,
  })
  public type: NotificationType;

  @Column({ type: 'text' })
  public title: string;

  @Column({ type: 'text' })
  public message: string;

  @Column({ type: 'boolean', default: false })
  public read: boolean;

  @Column({ type: 'jsonb', nullable: true })
  public metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;
}