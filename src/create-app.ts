import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { buildCors } from './cors';
import { setupSwagger } from './swagger/setup';

export async function createNestApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: buildCors(),
  });
  const config = app.get(ConfigService);
  const apiPrefix = config.get<string>('API_GLOBAL_PREFIX') ?? 'api';

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

  if (!process.env.VERCEL) {
    app.useWebSocketAdapter(new IoAdapter(app));
  }

  return app;
}
