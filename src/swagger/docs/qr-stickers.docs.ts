import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { EXAMPLE_IDS, QrStickersExamples } from '../examples';
import { BatchGenerateDto } from '../../qr-stickers/dto/batch-generate.dto';
import { applyDocs } from './apply-docs';

export const QrStickersControllerDocs = () =>
  applyDocs(ApiTags('QR Stickers'));

export const QrStickersLookupDocs = () =>
  applyDocs(
    ApiBearerAuth('jwt'),
    ApiOperation({
      summary: 'Owner scans a printed sticker while adding a car',
    }),
    ApiParam({
      name: 'code',
      description: 'Raw sticker code or full scanned URL',
      example: EXAMPLE_IDS.stickerCode,
    }),
    ApiOkResponse({
      description: 'Sticker availability before car creation',
      schema: { example: QrStickersExamples.lookupResponse.value },
    }),
  );

export const QrStickersBatchDocs = () =>
  applyDocs(
    ApiSecurity('admin-key'),
    ApiHeader({
      name: 'x-admin-key',
      description: 'Server `ADMIN_API_KEY` value',
      required: true,
      example: 'your-admin-api-key',
    }),
    ApiOperation({
      summary: 'Batch-generate unassigned stickers for printing (admin key)',
    }),
    ApiBody({
      type: BatchGenerateDto,
      examples: { default: QrStickersExamples.batchRequest },
    }),
    ApiOkResponse({
      description: 'Generated sticker batch with QR images',
      schema: { example: QrStickersExamples.batchResponse.value },
    }),
  );
