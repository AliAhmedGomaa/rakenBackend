import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { createNestApp } from './bootstrap';

async function bootstrap() {
  const app = await createNestApp();
  const config = app.get(ConfigService);
  const apiPrefix = config.get<string>('API_GLOBAL_PREFIX') ?? 'api';
  const port = config.get<number>('PORT') ?? 3000;

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Raken API listening on http://localhost:${port}/${apiPrefix}`,
  );
  // eslint-disable-next-line no-console
  console.log(
    `📚 Swagger UI at http://localhost:${port}/${apiPrefix}/docs`,
  );
}

// Required for Vercel zero-config NestJS entrypoint detection.
void bootstrap();
