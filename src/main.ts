import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { buildCors } from './cors';
import { setupSwagger } from './swagger/setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: buildCors() });
  const config = app.get(ConfigService);
  const apiPrefix = config.get<string>('API_GLOBAL_PREFIX') ?? 'api';
  const port = config.get<number>('PORT') ?? 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix(apiPrefix);
  setupSwagger(app);

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 Raken API listening on http://localhost:${port}/${apiPrefix}`);
  // eslint-disable-next-line no-console
  console.log(`📚 Swagger UI at http://localhost:${port}/${apiPrefix}/docs`);
}

void bootstrap();
