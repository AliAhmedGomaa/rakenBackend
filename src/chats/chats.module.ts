import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Car, CarSchema } from '../common/schemas/car.schema';
import { Chat, ChatSchema } from '../common/schemas/chat.schema';
import { ChatRealtimeModule } from '../chat-realtime/chat-realtime.module';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Car.name, schema: CarSchema },
    ]),
    AuthModule,
    ChatRealtimeModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
