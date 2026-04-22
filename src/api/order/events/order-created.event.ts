import { DomainEvent } from '../../../core/event-emitter.service';

export interface OrderCreatedPayload {
  orderId: number;
  userId: number;
  productVariationId: number;
  quantity: number;
}

export type OrderCreatedEvent = DomainEvent<OrderCreatedPayload>;

export const ORDER_CREATED_EVENT = 'OrderCreated' as const;
