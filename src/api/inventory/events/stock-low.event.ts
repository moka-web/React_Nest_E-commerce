import { DomainEvent } from '../../../core/event-emitter.service';

export interface StockLowPayload {
  productId: number;
  productVariationId: number;
  currentStock: number;
  threshold: number;
}

export type StockLowEvent = DomainEvent<StockLowPayload>;

export const STOCK_LOW_EVENT = 'StockLow' as const;
