import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /** POST /events — create and broadcast a new event */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  /** GET /events/latest — most recent 20 events */
  @Get('latest')
  findLatest() {
    return this.eventsService.findLatest();
  }

  /** GET /events — all events */
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }
}
