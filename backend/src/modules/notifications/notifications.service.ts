import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates an in-app notification record for the given event.
   * No external services — purely internal simulation.
   */
  async sendInAppNotification(eventId: number, eventType: string) {
    // Log the notification (interview requirement)
    console.log(`📣 In-app notification sent for event: ${eventType}`);

    // Persist to notifications table
    const notification = await this.prisma.notification.create({
      data: {
        eventId,
        channel: 'IN_APP',
        status: 'SENT',
      },
    });

    return notification;
  }

  /** Retrieve all notifications, newest first, with their linked event. */
  async findAll() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: { id: true, eventType: true, message: true, createdAt: true },
        },
      },
    });
  }
}
