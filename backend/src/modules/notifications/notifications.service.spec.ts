import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../database/prisma.service';

const mockPrisma = {
  notification: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  describe('sendInAppNotification', () => {
    it('should persist a notification record', async () => {
      mockPrisma.notification.create.mockResolvedValue({
        id: 1,
        eventId: 5,
        channel: 'IN_APP',
        status: 'SENT',
        createdAt: new Date(),
      });

      const result = await service.sendInAppNotification(5, 'ENTRY');

      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: { eventId: 5, channel: 'IN_APP', status: 'SENT' },
      });
      expect(result.channel).toBe('IN_APP');
      expect(result.status).toBe('SENT');
    });

    it('should log the notification to console', async () => {
      mockPrisma.notification.create.mockResolvedValue({ id: 1 });
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

      await service.sendInAppNotification(1, 'ALERT');

      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('ALERT'),
      );
      spy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return notifications with linked event data', async () => {
      const fake = [
        {
          id: 1,
          eventId: 1,
          channel: 'IN_APP',
          status: 'SENT',
          createdAt: new Date(),
          event: { id: 1, eventType: 'LOGIN', message: 'msg', createdAt: new Date() },
        },
      ];
      mockPrisma.notification.findMany.mockResolvedValue(fake);

      const result = await service.findAll();
      expect(result).toEqual(fake);
      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({ event: expect.anything() }),
        }),
      );
    });
  });
});
