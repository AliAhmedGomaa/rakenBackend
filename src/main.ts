import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function buildCors(): CorsOptions {
  const origins = process.env.CORS_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean);

  const base: Omit<CorsOptions, 'origin'> = {
    methods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'Origin',
      'X-Requested-With',
    ],
    credentials: process.env.CORS_CREDENTIALS !== 'false',
    maxAge: 86_400,
    optionsSuccessStatus: 204,
  };

  if (origins?.length) {
    return {
      ...base,
      origin: origins,
    };
  }

  return {
    ...base,
    origin: (
      _: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      callback(null, true);
    },
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: buildCors() });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 Raken API listening on http://localhost:${port}/api`);
}
void bootstrap();
