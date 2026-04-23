import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import {
  ProductCreatedEvent,
  PRODUCT_CREATED_EVENT,
} from '../events/product-created.event';

@Injectable()
export class ProductCreatedConsumer {
  private readonly logger = new Logger(ProductCreatedConsumer.name);

  constructor(private readonly eventEmitter: EventEmitter) {
    this.register();
  }

  private register(): void {
    this.eventEmitter.on(PRODUCT_CREATED_EVENT, this.handle.bind(this));
  }

  private async handle(event: ProductCreatedEvent): Promise<void> {
    const { productId, name, merchantId, categoryId } = event.payload;

    this.logger.log(`Product created: ${name} - ID: ${productId}`);
    this.logger.log(`Merchant: ${merchantId}, Category: ${categoryId}`);
    this.logger.log(`[TODO] Notify admin or update search index`);

    // TODO: Aquí iría lógica real (notificar admin, actualizar índices, etc.)
  }
}
