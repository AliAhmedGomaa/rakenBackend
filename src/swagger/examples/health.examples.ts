import type { SwaggerExample } from './types';

export const HealthExamples = {
  response: {
    summary: 'Service is up',
    value: {
      ok: true,
      service: 'raken-backend',
      time: '2026-06-20T12:00:00.000Z',
    },
  } satisfies SwaggerExample,
} as const;
