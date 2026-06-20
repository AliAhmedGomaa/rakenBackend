import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  QrStickersBatchDocs,
  QrStickersControllerDocs,
  QrStickersLookupDocs,
} from '../swagger/docs';
import { BatchGenerateDto } from './dto/batch-generate.dto';
import { QrStickersService } from './qr-stickers.service';

@QrStickersControllerDocs()
@Controller('qr-stickers')
export class QrStickersController {
  constructor(
    private readonly stickers: QrStickersService,
    private readonly config: ConfigService,
  ) {}

  @Get('lookup/:code')
  @UseGuards(JwtAuthGuard)
  @QrStickersLookupDocs()
  lookup(@Param('code') code: string) {
    return this.stickers.lookupForOwner(code);
  }

  @Post('batch')
  @QrStickersBatchDocs()
  batch(
    @Headers('x-admin-key') adminKey: string | undefined,
    @Body() dto: BatchGenerateDto,
  ) {
    const expected = this.config.get<string>('ADMIN_API_KEY');
    if (!expected || adminKey !== expected) {
      throw new UnauthorizedException('Invalid admin key.');
    }
    return this.stickers.generateBatch(dto.count);
  }
}
