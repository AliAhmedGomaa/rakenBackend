import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardExamples } from '../examples';
import { applyDocs } from './apply-docs';

export const DashboardControllerDocs = () =>
  applyDocs(ApiTags('Dashboard'), ApiBearerAuth('jwt'));

export const DashboardSummaryDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Owner dashboard summary (cars + chats)' }),
    ApiOkResponse({
      description: 'Aggregated stats and recent chats',
      schema: { example: DashboardExamples.summaryResponse.value },
    }),
  );
