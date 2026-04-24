import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import {
  OrderCreatedEvent,
  ORDER_CREATED_EVENT,
} from '../events/order-created.event';
import { NotificationService } from '../../notification/services/notification.service';
import { NotificationType } from 'src/database/entities/notification.entity';

@Injectable()
export class OrderCreatedConsumer {
  private readonly logger = new Logger(OrderCreatedConsumer.name);

  constructor(
    private readonly eventEmitter: EventEmitter,
    private readonly notificationService: NotificationService,
  ) {
    this.register();
  }

  private register(): void {
    this.eventEmitter.on(ORDER_CREATED_EVENT, this.handle.bind(this));
  }

  private async handle(event: OrderCreatedEvent): Promise<void> {
    const { orderId, userId, productVariationId, quantity } = event.payload;

    this.logger.log(
      `Order created: #${orderId} - User: ${userId}, ` +
        `ProductVariation: ${productVariationId}, Qty: ${quantity}`,
    );

    // Simular envío de email de confirmación
    this.logger.log(`[EMAIL] Sending order confirmation for order #${orderId}`);
    this.logger.log(`[EMAIL] Subject: Confirmación de tu pedido #${orderId}`);
    this.logger.log(`[EMAIL] Body: Tu pedido está siendo procesado...`);

    // Guardar evidencia de la notificación
    await this.notificationService.create(
      userId,
      NotificationType.ORDER_CONFIRMATION,
      'Pedido confirmado',
      `Tu pedido #${orderId} ha sido confirmado. Cantidad: ${quantity} unidades.`,
      { orderId, productVariationId, quantity },
    );
  }
}
