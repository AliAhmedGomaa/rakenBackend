import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from '../common/schemas/car.schema';
import { Chat, ChatSchema } from '../common/schemas/chat.schema';
import { User, UserSchema } from '../common/schemas/user.schema';
import { QrStickersModule } from '../qr-stickers/qr-stickers.module';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Car.name, schema: CarSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
    ]),
    QrStickersModule,
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
