import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import { ORDER_CREATED_EVENT } from '../events/order-created.event';
import { Order, OrderStatus } from 'src/database/entities/order.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { InventoryService } from '../../inventory/services/inventory.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly eventEmitter: EventEmitter,
    private readonly inventoryService: InventoryService,
  ) {}

  /**
   * Crea un pedido y reserva stock
   */
  async createOrder(
    userId: number,
    productVariationId: number,
    countryCode: string,
    quantity: number,
  ): Promise<Order> {
    // Reservar stock en inventory
    await this.inventoryService.reserveStock(
      productVariationId,
      countryCode,
      quantity,
    );

    // Crear registro de pedido
    const order = this.entityManager.create(Order, {
      userId,
      productVariationId,
      countryCode,
      quantity,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.entityManager.save(order);

    // Emitir evento
    const event = this.eventEmitter.createEvent(ORDER_CREATED_EVENT, {
      orderId: savedOrder.id,
      userId,
      productVariationId,
      quantity,
    });
    await this.eventEmitter.emit(event);

    this.logger.log(`Order ${savedOrder.id} created and stock reserved`);

    return savedOrder;
  }

  /**
   * Cancela un pedido y libera stock
   */
  async cancelOrder(orderId: number): Promise<Order> {
    const order = await this.entityManager.findOne(Order, {
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new NotFoundException('Order already cancelled');
    }

    // Liberar stock
    await this.inventoryService.releaseStock(
      order.productVariationId,
      order.countryCode,
      order.quantity,
    );

    // Actualizar estado
    order.status = OrderStatus.CANCELLED;
    await this.entityManager.save(order);

    this.logger.log(`Order ${orderId} cancelled and stock released`);

    return order;
  }
}
