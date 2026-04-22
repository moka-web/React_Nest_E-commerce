import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Inventory } from '../../database/entities/inventory.entity';
import { InventoryService } from './services/inventory.service';
import { EventEmitter } from '../../core/event-emitter.service';
import { StockLowConsumer } from './consumers/stock-low.consumer';
import { OutOfStockConsumer } from './consumers/out-of-stock.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  providers: [
    InventoryService,
    EventEmitter,
    StockLowConsumer,
    OutOfStockConsumer,
  ],
  exports: [InventoryService],
})
export class InventoryModule {}
