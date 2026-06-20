import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ChatsControllerDocs,
  ChatsFindOneDocs,
  ChatsListDocs,
  ChatsMarkReadDocs,
  ChatsRemoveDocs,
  ChatsSendMessageDocs,
  ChatsStartDocs,
} from '../swagger/docs';
import { ChatsService } from './chats.service';
import { SendMessageDto } from './dto/send-message.dto';
import { StartChatDto } from './dto/start-chat.dto';

@ChatsControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chats: ChatsService) {}

  @Get()
  @ChatsListDocs()
  list(@CurrentUser() user: AuthUser) {
    return this.chats.list(user.id);
  }

  @Post()
  @ChatsStartDocs()
  start(@CurrentUser() user: AuthUser, @Body() dto: StartChatDto) {
    return this.chats.start(user.id, dto);
  }

  @Get(':id')
  @ChatsFindOneDocs()
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.chats.findOne(user.id, id);
  }

  @Post(':id/messages')
  @ChatsSendMessageDocs()
  send(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chats.sendMessage(user.id, id, dto);
  }

  @Post(':id/read')
  @ChatsMarkReadDocs()
  markRead(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.chats.markRead(user.id, id);
  }

  @Delete(':id')
  @ChatsRemoveDocs()
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.chats.remove(user.id, id);
  }
}
