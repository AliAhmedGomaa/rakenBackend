import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ChatsExamples, EXAMPLE_IDS } from '../examples';
import { SendMessageDto } from '../../chats/dto/send-message.dto';
import { StartChatDto } from '../../chats/dto/start-chat.dto';
import { applyDocs } from './apply-docs';

export const ChatsControllerDocs = () =>
  applyDocs(ApiTags('Chats'), ApiBearerAuth('jwt'));

export const ChatsListDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'List chat threads for the authenticated owner' }),
    ApiOkResponse({
      description: 'Chat threads',
      schema: { example: ChatsExamples.listResponse.value },
    }),
  );

export const ChatsStartDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Start a new chat thread for a car' }),
    ApiBody({
      type: StartChatDto,
      examples: { default: ChatsExamples.startRequest },
    }),
    ApiOkResponse({
      description: 'Created chat',
      schema: { example: ChatsExamples.chatResponse.value },
    }),
  );

export const ChatsFindOneDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Get a single chat thread with messages' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.chatId }),
    ApiOkResponse({
      description: 'Chat thread',
      schema: { example: ChatsExamples.chatResponse.value },
    }),
  );

export const ChatsSendMessageDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Send a message in a chat thread' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.chatId }),
    ApiBody({
      type: SendMessageDto,
      examples: { default: ChatsExamples.sendMessageRequest },
    }),
    ApiOkResponse({
      description: 'Updated chat with new message',
      schema: { example: ChatsExamples.chatResponse.value },
    }),
  );

export const ChatsMarkReadDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Mark all messages in a thread as read' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.chatId }),
    ApiOkResponse({
      description: 'Unread count cleared',
      schema: { example: ChatsExamples.markReadResponse.value },
    }),
  );

export const ChatsRemoveDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Delete a chat thread' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.chatId }),
    ApiOkResponse({
      description: 'Deletion acknowledged',
      schema: { example: ChatsExamples.deleteResponse.value },
    }),
  );
