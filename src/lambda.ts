import serverlessExpress from '@codegenie/serverless-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import type { Request, Response } from 'express';
import { createNestApp } from './create-app';

type ServerlessHandler = (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;

let handlerPromise: Promise<ServerlessHandler> | undefined;

async function buildHandler(): Promise<ServerlessHandler> {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await createNestApp(adapter);
  await app.init();
  return serverlessExpress({ app: expressApp });
}

async function getHandler(): Promise<ServerlessHandler> {
  handlerPromise ??= buildHandler();
  return handlerPromise;
}

export default async function handler(req: Request, res: Response) {
  try {
    const h = await getHandler();
    return h(req, res);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize NestJS handler:', err);
    if (!res.headersSent) {
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          statusCode: 503,
          message:
            'Service temporarily unavailable. Check MONGODB_URI and Atlas Network Access (allow 0.0.0.0/0 for Vercel).',
        }),
      );
    }
  }
}
