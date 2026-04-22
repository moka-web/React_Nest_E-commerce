import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import {
  OrderCreatedEvent,
  ORDER_CREATED_EVENT,
} from '../events/order-created.event';

@Injectable()
export class OrderCreatedConsumer {
  private readonly logger = new Logger(OrderCreatedConsumer.name);

  constructor(private readonly eventEmitter: EventEmitter) {
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
    this.logger.log(`[TODO] Send order confirmation to user`);

    // TODO: Enviar email de confirmación de pedido
  }
}
