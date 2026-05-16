import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SendContactDto } from './dto/send-contact.dto';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('cars/:id')
  getCar(@Param('id') id: string) {
    return this.publicService.getPublicCar(id);
  }

  @Post('cars/:id/contact')
  sendContact(@Param('id') id: string, @Body() dto: SendContactDto) {
    return this.publicService.sendContact(id, dto);
  }

  /**
   * Returns the messages the visitor already exchanged with this car owner,
   * keyed by their opaque `visitorToken`. Used by the web UI to re-hydrate
   * the in-page chat after a refresh.
   */
  @Get('cars/:id/thread')
  getThread(
    @Param('id') id: string,
    @Query('visitorToken') visitorToken: string,
  ) {
    return this.publicService.getVisitorThread(id, visitorToken);
  }
}
