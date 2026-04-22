import { DomainEvent } from '../../../core/event-emitter.service';

export interface ProductCreatedPayload {
  productId: number;
  name: string;
  merchantId: number;
  categoryId?: number;
}

export type ProductCreatedEvent = DomainEvent<ProductCreatedPayload>;

export const PRODUCT_CREATED_EVENT = 'ProductCreated' as const;
