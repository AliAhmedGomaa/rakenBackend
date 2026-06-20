import { ConfigService } from '@nestjs/config';
import { createNestApp } from './bootstrap';

export { default } from './serverless';

async function startLocal() {
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

if (!process.env.VERCEL) {
  void startLocal();
}
