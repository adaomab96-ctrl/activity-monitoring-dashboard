import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** GET /notifications — all in-app notifications */
  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }
}
