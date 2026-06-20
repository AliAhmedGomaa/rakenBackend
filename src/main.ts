import { ConfigService } from '@nestjs/config';
import { createNestApp } from './create-app';

// Fallback export if Vercel still picks up src/main.ts as the function entry.
export { default } from './lambda';

async function bootstrap() {
  const app = await createNestApp();
  const config = app.get(ConfigService);
  const apiPrefix = config.get<string>('API_GLOBAL_PREFIX') ?? 'api';
  const port = config.get<number>('PORT') ?? 3000;

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 Raken API listening on http://localhost:${port}/${apiPrefix}`);
  // eslint-disable-next-line no-console
  console.log(`📚 Swagger UI at http://localhost:${port}/${apiPrefix}/docs`);
}

if (!process.env.VERCEL && require.main === module) {
  void bootstrap();
}
