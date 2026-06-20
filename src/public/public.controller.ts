import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  PublicControllerDocs,
  PublicGetCarDocs,
  PublicGetStickerDocs,
  PublicGetThreadDocs,
  PublicSendContactDocs,
} from '../swagger/docs';
import { SendContactDto } from './dto/send-contact.dto';
import { PublicService } from './public.service';

@PublicControllerDocs()
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('cars/:id')
  @PublicGetCarDocs()
  getCar(@Param('id') id: string) {
    return this.publicService.getPublicCar(id);
  }

  @Post('cars/:id/contact')
  @PublicSendContactDocs()
  sendContact(@Param('id') id: string, @Body() dto: SendContactDto) {
    return this.publicService.sendContact(id, dto);
  }

  @Get('cars/:id/thread')
  @PublicGetThreadDocs()
  getThread(
    @Param('id') id: string,
    @Query('visitorToken') visitorToken: string,
  ) {
    return this.publicService.getVisitorThread(id, visitorToken);
  }

  @Get('stickers/:code')
  @PublicGetStickerDocs()
  getSticker(@Param('code') code: string) {
    return this.publicService.getStickerStatus(code);
  }
}
