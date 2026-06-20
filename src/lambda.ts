import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppModule } from './app.module';
import { buildCors } from './cors';
import { setupSwagger } from './swagger/setup';

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

let cachedHandler: Handler | undefined;

async function getHandler(): Promise<Handler> {
  if (!cachedHandler) {
    const app = await NestFactory.create(AppModule, { cors: buildCors() });
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
    await app.init();

    cachedHandler = app.getHttpAdapter().getInstance() as Handler;
  }
  return cachedHandler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const h = await getHandler();
  h(req, res);
}
