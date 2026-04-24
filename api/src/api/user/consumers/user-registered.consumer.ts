import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from '../../../core/event-emitter.service';
import {
  UserRegisteredEvent,
  USER_REGISTERED_EVENT,
} from '../events/user-registered.event';
import { NotificationService } from '../../notification/services/notification.service';
import { NotificationType } from 'src/database/entities/notification.entity';

@Injectable()
export class UserRegisteredConsumer {
  private readonly logger = new Logger(UserRegisteredConsumer.name);

  constructor(
    private readonly eventEmitter: EventEmitter,
    private readonly notificationService: NotificationService,
  ) {
    this.register();
  }

  private register(): void {
    this.eventEmitter.on(USER_REGISTERED_EVENT, this.handle.bind(this));
  }

  private async handle(event: UserRegisteredEvent): Promise<void> {
    const { userId, email } = event.payload;

    this.logger.log(`User registered: ${email} - ID: ${userId}`);

    // Simular envío de email de bienvenida
    this.logger.log(`[EMAIL] Sending welcome email to: ${email}`);
    this.logger.log(`[EMAIL] Subject: Bienvenido a nuestra tienda!`);
    this.logger.log(`[EMAIL] Body: Hola! Gracias por registrarte...`);

    // Guardar evidencia de la notificación
    await this.notificationService.create(
      userId,
      NotificationType.WELCOME,
      '¡Bienvenido!',
      'Gracias por registrarte en nuestra tienda. Explora nuestros productos y disfruta de las mejores ofertas.',
      { email },
    );
  }
}
