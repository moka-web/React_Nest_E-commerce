import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import {
  UserRegisteredEvent,
  USER_REGISTERED_EVENT,
} from '../events/user-registered.event';

@Injectable()
export class UserRegisteredConsumer {
  private readonly logger = new Logger(UserRegisteredConsumer.name);

  constructor(private readonly eventEmitter: EventEmitter) {
    this.register();
  }

  private register(): void {
    this.eventEmitter.on(USER_REGISTERED_EVENT, this.handle.bind(this));
  }

  private async handle(event: UserRegisteredEvent): Promise<void> {
    const { userId, email } = event.payload;

    this.logger.log(`User registered: ${email} - ID: ${userId}`);
    this.logger.log(`[TODO] Send welcome email to: ${email}`);

    // TODO: Aquí iría la lógica real de email
    // await this.emailService.sendWelcome(email);
  }
}
