import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HealthExamples } from '../examples';
import { applyDocs } from './apply-docs';

export const HealthControllerDocs = () =>
  applyDocs(ApiTags('Health'));

export const HealthCheckDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Health check' }),
    ApiOkResponse({
      description: 'Service status',
      schema: { example: HealthExamples.response.value },
    }),
  );
