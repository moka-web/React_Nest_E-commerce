import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import {
  OutOfStockEvent,
  OUT_OF_STOCK_EVENT,
} from '../events/out-of-stock.event';

@Injectable()
export class OutOfStockConsumer {
  private readonly logger = new Logger(OutOfStockConsumer.name);

  constructor(private readonly eventEmitter: EventEmitter) {
    this.register();
  }

  private register(): void {
    this.eventEmitter.on(OUT_OF_STOCK_EVENT, this.handle.bind(this));
  }

  private async handle(event: OutOfStockEvent): Promise<void> {
    const { productId, productVariationId } = event.payload;

    this.logger.warn(
      `OUT OF STOCK: Product ${productId}, Variation ${productVariationId}`,
    );
    this.logger.log(`[TODO] Disable product or notify admin`);

    // TODO: Deshabilitar producto o notificar al admin
  }
}
