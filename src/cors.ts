import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function buildCors(): CorsOptions {
  const origins = process.env.CORS_ORIGINS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

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
