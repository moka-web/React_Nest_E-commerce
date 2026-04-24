import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  Notification,
  NotificationType,
} from 'src/database/entities/notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, any>,
  ): Promise<Notification> {
    const notification = this.entityManager.create(Notification, {
      userId,
      type,
      title,
      message,
      metadata,
    });

    const saved = await this.entityManager.save(notification);
    this.logger.log(`Notification created for user ${userId}: ${title}`);
    return saved;
  }

  async findByUser(userId: number, limit = 20): Promise<Notification[]> {
    return this.entityManager.find(Notification, {
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async markAsRead(id: number): Promise<void> {
    await this.entityManager.update(Notification, id, { read: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.entityManager.update(Notification, { userId }, { read: true });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.entityManager.count(Notification, {
      where: { userId, read: false },
    });
  }
}