import { DomainEvent } from '../../../core/event-emitter.service';

export interface OutOfStockPayload {
  productId: number;
  productVariationId: number;
}

export type OutOfStockEvent = DomainEvent<OutOfStockPayload>;

export const OUT_OF_STOCK_EVENT = 'OutOfStock' as const;
