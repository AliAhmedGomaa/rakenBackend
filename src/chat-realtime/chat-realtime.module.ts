import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '../common/schemas/chat.schema';
import { User, UserSchema } from '../common/schemas/user.schema';
import { ChatGateway } from './chat.gateway';
import { ChatRealtimeService } from './chat-realtime.service';
import { PushNotificationsService } from './push-notifications.service';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ChatGateway, ChatRealtimeService, PushNotificationsService],
  exports: [ChatRealtimeService, PushNotificationsService],
})
export class ChatRealtimeModule {}
