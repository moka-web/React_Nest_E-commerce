import { DomainEvent } from '../../../core/event-emitter.service';

export interface UserRegisteredPayload {
  userId: number;
  email: string;
}

export type UserRegisteredEvent = DomainEvent<UserRegisteredPayload>;

export const USER_REGISTERED_EVENT = 'UserRegistered' as const;
