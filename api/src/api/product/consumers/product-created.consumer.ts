import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import {
  ProductCreatedEvent,
  PRODUCT_CREATED_EVENT,
} from '../events/product-created.event';
import { NotificationService } from '../../notification/services/notification.service';
import { NotificationType } from 'src/database/entities/notification.entity';

@Injectable()
export class ProductCreatedConsumer {
  private readonly logger = new Logger(ProductCreatedConsumer.name);

  constructor(
    private readonly eventEmitter: EventEmitter,
    private readonly notificationService: NotificationService,
  ) {
    this.register();
  }

  private register(): void {
    this.eventEmitter.on(PRODUCT_CREATED_EVENT, this.handle.bind(this));
  }

  private async handle(event: ProductCreatedEvent): Promise<void> {
    const { productId, name, merchantId, categoryId } = event.payload;

    this.logger.log(`Product created: ${name} - ID: ${productId}`);
    this.logger.log(`Merchant: ${merchantId}, Category: ${categoryId}`);

    // Simular notificación a admin (notificar al merchant sobre su producto)
    this.logger.log(`[SYSTEM] Notifying merchant ${merchantId} about new product`);
    this.logger.log(`[SYSTEM] Product ${name} is pending review`);

    // Guardar evidencia de la notificación
    await this.notificationService.create(
      merchantId,
      NotificationType.PRODUCT_CREATED,
      'Producto creado',
      `Tu producto "${name}" ha sido creado exitosamente. ID: #${productId}`,
      { productId, categoryId },
    );
  }
}
