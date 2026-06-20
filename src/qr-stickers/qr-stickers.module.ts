import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QrSticker,
  QrStickerSchema,
} from '../common/schemas/qr-sticker.schema';
import { QrStickersController } from './qr-stickers.controller';
import { QrStickersService } from './qr-stickers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QrSticker.name, schema: QrStickerSchema },
    ]),
  ],
  controllers: [QrStickersController],
  providers: [QrStickersService],
  exports: [QrStickersService],
})
export class QrStickersModule {}
