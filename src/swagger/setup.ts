import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger';

const SWAGGER_UI_CDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0';

function buildSwaggerCdnHtml(specUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Raken API Docs</title>
  <link rel="stylesheet" href="${SWAGGER_UI_CDN}/swagger-ui.css" />
  <style>html { box-sizing: border-box; overflow-y: scroll; } *, *:before, *:after { box-sizing: inherit; } body { margin: 0; background: #fafafa; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${SWAGGER_UI_CDN}/swagger-ui-bundle.js"></script>
  <script src="${SWAGGER_UI_CDN}/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      SwaggerUIBundle({
        url: '${specUrl}',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: 'StandaloneLayout',
      });
    };
  </script>
</body>
</html>`;
}

/** CDN-based Swagger UI for Vercel/serverless where swagger-ui-dist files are not bundled. */
function setupSwaggerCdn(app: INestApplication, document: OpenAPIObject): void {
  const config = app.get(ConfigService);
  const apiPrefix = config.get<string>('API_GLOBAL_PREFIX') ?? 'api';
  const docsPath = `/${apiPrefix}/docs`;
  const specUrl = `/${apiPrefix}/docs-json`;

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    jsonDocumentUrl: 'docs-json',
    ui: false,
    raw: ['json'],
  });

  const http = app.getHttpAdapter().getInstance();
  const html = buildSwaggerCdnHtml(specUrl);

  for (const path of [docsPath, `${docsPath}/`, `${docsPath}/index.html`]) {
    http.get(path, (_req: unknown, res: { type: (t: string) => { send: (b: string) => void } }) => {
      res.type('text/html').send(html);
    });
  }
}

export function setupSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Raken API')
    .setDescription(
      'REST API for Raken — car owners, QR stickers, anonymous contact, and admin operations.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Owner or admin JWT from `/auth/login` or `/auth/register`',
      },
      'jwt',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-admin-key',
        in: 'header',
        description: 'Server-side admin key for sticker batch generation',
      },
      'admin-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  if (process.env.VERCEL) {
    setupSwaggerCdn(app, document);
    return;
  }

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    jsonDocumentUrl: 'docs-json',
  });
}
