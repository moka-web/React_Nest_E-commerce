import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { EventEmitter } from '../../core/event-emitter.service';
import { OrderCreatedConsumer } from './consumers/order-created.consumer';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), AuthModule],
  controllers: [OrderController],
  providers: [OrderService, EventEmitter, OrderCreatedConsumer],
  exports: [OrderService],
})
export class OrderModule {}
