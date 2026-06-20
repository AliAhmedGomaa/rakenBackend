import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AdminExamples, EXAMPLE_IDS } from '../examples';
import { AdminBatchStickersDto } from '../../admin/dto/admin-batch-stickers.dto';
import { CreateAdminDto } from '../../admin/dto/create-admin.dto';
import { UpdateAdminCarDto } from '../../admin/dto/update-admin-car.dto';
import { applyDocs } from './apply-docs';

export const AdminControllerDocs = () => applyDocs(ApiTags('Admin'));

export const AdminSummaryDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'Platform-wide admin dashboard summary' }),
    ApiOkResponse({
      description: 'Aggregate counts and recent owners',
      schema: { example: AdminExamples.summaryResponse.value },
    }),
  );

export const AdminCreateAdminDocs = () =>
  applyDocs(
    ApiOperation({
      summary: 'Create a new admin account',
      description:
        'Public bootstrap endpoint — no JWT required. Fails with 409 if the email is already registered.',
    }),
    ApiBody({
      type: CreateAdminDto,
      examples: { default: AdminExamples.createAdminRequest },
    }),
    ApiCreatedResponse({
      description: 'Admin user created',
      schema: { example: AdminExamples.createAdminResponse.value },
    }),
  );

export const AdminListUsersDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'List all car owners' }),
    ApiOkResponse({
      description: 'Owners with car counts',
      schema: { example: AdminExamples.usersListResponse.value },
    }),
  );

export const AdminGetUserDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'Get one owner with cars and recent chats' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.userId }),
    ApiOkResponse({
      description: 'Owner detail',
      schema: {
        example: {
          ...AdminExamples.usersListResponse.value[0],
          cars: [],
          chats: [],
        },
      },
    }),
  );

export const AdminListCarsDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'List all cars on the platform' }),
    ApiOkResponse({ description: 'All cars' }),
  );

export const AdminGetCarDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'Get one car (admin view)' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.carId }),
    ApiOkResponse({ description: 'Car with owner info' }),
  );

export const AdminUpdateCarDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'Update any car (admin)' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.carId }),
    ApiBody({
      type: UpdateAdminCarDto,
      examples: { default: AdminExamples.updateCarRequest },
    }),
    ApiOkResponse({ description: 'Updated car' }),
  );

export const AdminDeleteCarDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'Delete a car (admin)' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.carId }),
    ApiOkResponse({
      description: 'Deletion acknowledged',
      schema: { example: AdminExamples.deleteResponse.value },
    }),
  );

export const AdminListChatsDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'List all chat threads' }),
    ApiOkResponse({ description: 'All chats' }),
  );

export const AdminGetChatDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'Get one chat thread (admin view)' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.chatId }),
    ApiOkResponse({ description: 'Chat with messages' }),
  );

export const AdminDeleteChatDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'Delete a chat thread (admin)' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.chatId }),
    ApiOkResponse({
      description: 'Deletion acknowledged',
      schema: { example: AdminExamples.deleteResponse.value },
    }),
  );

export const AdminListStickersDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'List QR stickers' }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ['assigned', 'unassigned'],
      example: 'unassigned',
    }),
    ApiOkResponse({ description: 'Sticker inventory' }),
  );

export const AdminGenerateStickersDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({
      summary: 'Batch-generate unassigned QR stickers (admin JWT)',
    }),
    ApiBody({
      type: AdminBatchStickersDto,
      examples: { default: AdminExamples.batchStickersRequest },
    }),
    ApiOkResponse({
      description: 'Generated stickers',
      schema: { example: AdminExamples.batchStickersResponse.value },
    }),
  );
