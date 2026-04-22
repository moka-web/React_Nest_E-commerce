import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import { StockLowEvent, STOCK_LOW_EVENT } from '../events/stock-low.event';

@Injectable()
export class StockLowConsumer {
  private readonly logger = new Logger(StockLowConsumer.name);

  constructor(private readonly eventEmitter: EventEmitter) {
    this.register();
  }

  private register(): void {
    this.eventEmitter.on(STOCK_LOW_EVENT, this.handle.bind(this));
  }

  private async handle(event: StockLowEvent): Promise<void> {
    const { productId, productVariationId, currentStock, threshold } =
      event.payload;

    this.logger.warn(
      `LOW STOCK: Product ${productId}, Variation ${productVariationId} - ` +
        `Stock: ${currentStock} (threshold: ${threshold})`,
    );
    this.logger.log(`[TODO] Notify admin: low stock alert`);

    // TODO: Notificar al admin (email, push, etc.)
  }
}
