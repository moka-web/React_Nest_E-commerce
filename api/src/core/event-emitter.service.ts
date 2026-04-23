import { Injectable, Logger } from '@nestjs/common';

export interface EventMetadata {
  timestamp: Date;
  correlationId: string;
}

export interface DomainEvent<T = any> {
  eventName: string;
  payload: T;
  metadata: EventMetadata;
}

type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void>;

@Injectable()
export class EventEmitter {
  private readonly logger = new Logger(EventEmitter.name);
  private handlers: Map<string, Set<EventHandler>> = new Map();

  /**
   * Registra un consumidor para un evento específico
   */
  on<T = any>(eventName: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler);
    this.logger.log(`Registered handler for event: ${eventName}`);
  }

  /**
   * Emite un evento y Notifica a todos los consumidores registrados
   */
  async emit<T = any>(event: DomainEvent<T>): Promise<void> {
    const handlers = this.handlers.get(event.eventName);

    if (!handlers || handlers.size === 0) {
      this.logger.warn(`No handlers registered for event: ${event.eventName}`);
      return;
    }

    this.logger.log(
      `Emitting event: ${event.eventName} to ${handlers.size} handler(s)`,
    );

    const promises = Array.from(handlers).map((handler) =>
      handler(event).catch((error) => {
        this.logger.error(
          `Error in handler for ${event.eventName}: ${error.message}`,
        );
      }),
    );

    await Promise.all(promises);
  }

  /**
   * Crea un evento con metadata automáticos
   */
  createEvent<T = any>(eventName: string, payload: T): DomainEvent<T> {
    return {
      eventName,
      payload,
      metadata: {
        timestamp: new Date(),
        correlationId: this.generateCorrelationId(),
      },
    };
  }

  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
