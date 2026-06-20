import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EXAMPLE_IDS, PublicExamples } from '../examples';
import { SendContactDto } from '../../public/dto/send-contact.dto';
import { applyDocs } from './apply-docs';

export const PublicControllerDocs = () => applyDocs(ApiTags('Public'));

export const PublicGetCarDocs = () =>
  applyDocs(
    ApiOperation({
      summary: 'Get public car details by sticker code or legacy car ID',
    }),
    ApiParam({
      name: 'id',
      description: 'Printed sticker code (e.g. RK-8F2K9M) or Mongo car ID',
      example: EXAMPLE_IDS.stickerCode,
    }),
    ApiOkResponse({
      description: 'Public car view for QR scan page',
      schema: { example: PublicExamples.publicCarResponse.value },
    }),
  );

export const PublicSendContactDocs = () =>
  applyDocs(
    ApiOperation({
      summary: 'Send an anonymous contact message to the car owner',
    }),
    ApiParam({
      name: 'id',
      description: 'Sticker code or car ID',
      example: EXAMPLE_IDS.stickerCode,
    }),
    ApiBody({
      type: SendContactDto,
      examples: {
        firstMessage: PublicExamples.contactRequest,
        followUp: PublicExamples.contactFollowUpRequest,
      },
    }),
    ApiOkResponse({
      description: 'Message stored; returns visitor token for follow-ups',
      schema: { example: PublicExamples.contactResponse.value },
    }),
  );

export const PublicGetThreadDocs = () =>
  applyDocs(
    ApiOperation({
      summary: 'Re-hydrate visitor chat history after a page refresh',
    }),
    ApiParam({
      name: 'id',
      description: 'Sticker code or car ID',
      example: EXAMPLE_IDS.stickerCode,
    }),
    ApiQuery({
      name: 'visitorToken',
      required: true,
      example: EXAMPLE_IDS.visitorToken,
    }),
    ApiOkResponse({
      description: 'Messages for this visitor on this car',
      schema: { example: PublicExamples.threadResponse.value },
    }),
  );

export const PublicGetStickerDocs = () =>
  applyDocs(
    ApiOperation({
      summary: 'Check whether a printed sticker exists and is linked to a car',
    }),
    ApiParam({ name: 'code', example: EXAMPLE_IDS.stickerCode }),
    ApiOkResponse({
      description: 'Sticker status',
      schema: { example: PublicExamples.stickerStatusResponse.value },
    }),
  );
