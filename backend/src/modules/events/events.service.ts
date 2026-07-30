import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ActivityGateway } from '../websocket/activity.gateway';
import { CreateEventDto } from './dto/create-event.dto';
import { EventType } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly gateway: ActivityGateway,
  ) {}

  /**
   * Core flow:
   * 1. Save event to PostgreSQL
   * 2. Trigger notification service
   * 3. Broadcast via Socket.io
   */
  async create(dto: CreateEventDto) {
    // 1. Persist
    const event = await this.prisma.event.create({
      data: {
        eventType: dto.type as EventType,
        message: dto.message,
      },
    });

    // 2. Notify (fire-and-forget — don't block response)
    this.notifications
      .sendInAppNotification(event.id, event.eventType)
      .catch((err) => console.error('Notification error:', err));

    // 3. Broadcast
    this.gateway.emitNewEvent({
      id: event.id,
      eventType: event.eventType,
      message: event.message,
      createdAt: event.createdAt.toISOString(),
    });

    return {
      id: event.id,
      type: event.eventType,
      message: event.message,
      createdAt: event.createdAt.toISOString(),
    };
  }

  /** GET /events — all events, newest first */
  async findAll() {
    const events = await this.prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return events.map(this.serialize);
  }

  /** GET /events/latest — 20 most recent events */
  async findLatest() {
    const events = await this.prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return events.map(this.serialize);
  }

  private serialize(event: {
    id: number;
    eventType: EventType;
    message: string;
    createdAt: Date;
  }) {
    return {
      id: event.id,
      type: event.eventType,
      message: event.message,
      createdAt: event.createdAt.toISOString(),
    };
  }
}
