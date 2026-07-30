import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ActivityGateway } from '../websocket/activity.gateway';
import { EventType } from './dto/create-event.dto';

// Minimal mocks — we test the service logic, not the ORM or transport
const mockPrisma = {
  event: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

const mockNotifications = {
  sendInAppNotification: jest.fn().mockResolvedValue({}),
};

const mockGateway = {
  emitNewEvent: jest.fn(),
};

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsService, useValue: mockNotifications },
        { provide: ActivityGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should persist the event and return serialised shape', async () => {
      const fakeEvent = {
        id: 1,
        eventType: 'ENTRY',
        message: 'Visitor entered building',
        createdAt: new Date('2026-01-01T10:00:00Z'),
      };
      mockPrisma.event.create.mockResolvedValue(fakeEvent);

      const result = await service.create({
        type: EventType.ENTRY,
        message: 'Visitor entered building',
      });

      expect(mockPrisma.event.create).toHaveBeenCalledWith({
        data: { eventType: 'ENTRY', message: 'Visitor entered building' },
      });
      expect(result).toEqual({
        id: 1,
        type: 'ENTRY',
        message: 'Visitor entered building',
        createdAt: '2026-01-01T10:00:00.000Z',
      });
    });

    it('should emit the event via WebSocket gateway', async () => {
      const fakeEvent = {
        id: 2,
        eventType: 'LOGIN',
        message: 'User logged in',
        createdAt: new Date('2026-01-01T11:00:00Z'),
      };
      mockPrisma.event.create.mockResolvedValue(fakeEvent);

      await service.create({ type: EventType.LOGIN, message: 'User logged in' });

      expect(mockGateway.emitNewEvent).toHaveBeenCalledWith({
        id: 2,
        eventType: 'LOGIN',
        message: 'User logged in',
        createdAt: '2026-01-01T11:00:00.000Z',
      });
    });

    it('should trigger the notification service', async () => {
      const fakeEvent = {
        id: 3,
        eventType: 'ALERT',
        message: 'Security alert',
        createdAt: new Date(),
      };
      mockPrisma.event.create.mockResolvedValue(fakeEvent);

      await service.create({ type: EventType.ALERT, message: 'Security alert' });

      // Give fire-and-forget a tick to run
      await new Promise((r) => setTimeout(r, 10));
      expect(mockNotifications.sendInAppNotification).toHaveBeenCalledWith(
        3,
        'ALERT',
      );
    });
  });

  describe('findAll', () => {
    it('should return all events serialised', async () => {
      mockPrisma.event.findMany.mockResolvedValue([
        { id: 1, eventType: 'ENTRY', message: 'msg', createdAt: new Date('2026-01-01T00:00:00Z') },
      ]);

      const result = await service.findAll();
      expect(result).toEqual([
        { id: 1, type: 'ENTRY', message: 'msg', createdAt: '2026-01-01T00:00:00.000Z' },
      ]);
    });
  });

  describe('findLatest', () => {
    it('should request the 20 most recent events', async () => {
      mockPrisma.event.findMany.mockResolvedValue([]);
      await service.findLatest();
      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 20 }),
      );
    });
  });
});
