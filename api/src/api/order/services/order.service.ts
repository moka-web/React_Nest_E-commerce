import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import { ORDER_CREATED_EVENT } from '../events/order-created.event';
import { Order, OrderStatus } from 'src/database/entities/order.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly eventEmitter: EventEmitter,
  ) {}

  /**
   * Crea un pedido
   */
  async createOrder(
    userId: number,
    productVariationId: number,
    countryCode: string,
    quantity: number,
  ): Promise<Order> {
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

    this.logger.log(`Order ${savedOrder.id} created`);

    return savedOrder;
  }

  /**
   * Cancela un pedido
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

    // Actualizar estado
    order.status = OrderStatus.CANCELLED;
    await this.entityManager.save(order);

    this.logger.log(`Order ${orderId} cancelled`);

    return order;
  }

  /**
   * Lista todos los pedidos
   */
  async findAll(): Promise<Order[]> {
    return this.entityManager.find(Order, {
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Lista pedidos de un usuario
   */
  async findByUser(userId: number): Promise<Order[]> {
    return this.entityManager.find(Order, {
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
