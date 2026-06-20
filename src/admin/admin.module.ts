import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Car, CarSchema } from '../common/schemas/car.schema';
import { Chat, ChatSchema } from '../common/schemas/chat.schema';
import {
  QrSticker,
  QrStickerSchema,
} from '../common/schemas/qr-sticker.schema';
import { User, UserSchema } from '../common/schemas/user.schema';
import { QrStickersModule } from '../qr-stickers/qr-stickers.module';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';

@Module({
  imports: [
    AuthModule,
    QrStickersModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Car.name, schema: CarSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: QrSticker.name, schema: QrStickerSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}
