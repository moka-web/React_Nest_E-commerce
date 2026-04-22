import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import { STOCK_LOW_EVENT } from '../events/stock-low.event';
import { OUT_OF_STOCK_EVENT } from '../events/out-of-stock.event';
import { Inventory } from 'src/database/entities/inventory.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

const STOCK_LOW_THRESHOLD = 5;

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly eventEmitter: EventEmitter,
  ) {}

  /**
   * Reserva stock para un pedido
   * Decrementa la cantidad y emite eventos si es necesario
   */
  async reserveStock(
    productVariationId: number,
    countryCode: string,
    quantity: number,
  ): Promise<Inventory> {
    // Buscar inventory actual
    const inventory = await this.entityManager.findOne(Inventory, {
      where: { productVariationId, countryCode },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    if (inventory.quantity < quantity) {
      throw new NotFoundException('Insufficient stock');
    }

    // Decrementar stock
    inventory.quantity -= quantity;
    await this.entityManager.save(inventory);

    // Verificar y emitir eventos
    await this.checkAndEmitStockEvents(inventory);

    return inventory;
  }

  /**
   * Libera stock cuando se cancela un pedido
   * Incrementa la cantidad
   */
  async releaseStock(
    productVariationId: number,
    countryCode: string,
    quantity: number,
  ): Promise<Inventory> {
    const inventory = await this.entityManager.findOne(Inventory, {
      where: { productVariationId, countryCode },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    // Incrementar stock
    inventory.quantity += quantity;
    await this.entityManager.save(inventory);

    return inventory;
  }

  /**
   * Obtiene el stock actual
   */
  async getStock(
    productVariationId: number,
    countryCode: string,
  ): Promise<number> {
    const inventory = await this.entityManager.findOne(Inventory, {
      where: { productVariationId, countryCode },
    });

    return inventory?.quantity ?? 0;
  }

  private async checkAndEmitStockEvents(inventory: Inventory): Promise<void> {
    const currentStock = inventory.quantity;

    // Emitir OutOfStock si stock = 0
    if (currentStock === 0) {
      const event = this.eventEmitter.createEvent(OUT_OF_STOCK_EVENT, {
        productId: inventory.productVariationId,
        productVariationId: inventory.productVariationId,
      });
      await this.eventEmitter.emit(event);
      return;
    }

    // Emitir LowStock si stock ≤ threshold
    if (currentStock <= STOCK_LOW_THRESHOLD) {
      const event = this.eventEmitter.createEvent(STOCK_LOW_EVENT, {
        productId: inventory.productVariationId,
        productVariationId: inventory.productVariationId,
        currentStock,
        threshold: STOCK_LOW_THRESHOLD,
      });
      await this.eventEmitter.emit(event);
    }
  }
}
