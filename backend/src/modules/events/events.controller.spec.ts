import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

const mockEventsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findLatest: jest.fn(),
};

describe('EventsController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: mockEventsService }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  describe('POST /events', () => {
    it('should create an event and return 201', async () => {
      const payload = { type: 'ENTRY', message: 'Visitor entered' };
      const response = {
        id: 1,
        type: 'ENTRY',
        message: 'Visitor entered',
        createdAt: '2026-01-01T00:00:00.000Z',
      };
      mockEventsService.create.mockResolvedValue(response);

      await request(app.getHttpServer())
        .post('/events')
        .send(payload)
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe(1);
          expect(res.body.type).toBe('ENTRY');
        });
    });

    it('should return 400 for invalid event type', async () => {
      await request(app.getHttpServer())
        .post('/events')
        .send({ type: 'INVALID', message: 'test' })
        .expect(400);
    });

    it('should return 400 when message is missing', async () => {
      await request(app.getHttpServer())
        .post('/events')
        .send({ type: 'ENTRY' })
        .expect(400);
    });
  });

  describe('GET /events', () => {
    it('should return an array of events', async () => {
      mockEventsService.findAll.mockResolvedValue([
        { id: 1, type: 'LOGIN', message: 'msg', createdAt: '2026-01-01T00:00:00.000Z' },
      ]);

      await request(app.getHttpServer())
        .get('/events')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0].type).toBe('LOGIN');
        });
    });
  });

  describe('GET /events/latest', () => {
    it('should return latest events', async () => {
      mockEventsService.findLatest.mockResolvedValue([]);
      await request(app.getHttpServer()).get('/events/latest').expect(200);
    });
  });
});
