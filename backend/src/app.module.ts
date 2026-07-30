import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { EventsModule } from './modules/events/events.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [DatabaseModule, EventsModule, NotificationsModule, WebsocketModule],
})
export class AppModule {}
