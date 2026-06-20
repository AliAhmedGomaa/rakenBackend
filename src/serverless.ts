import serverlessExpress from '@codegenie/serverless-express';
import type { Request, Response } from 'express';
import { createNestApp } from './bootstrap';

type ServerlessHandler = (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;

let handlerPromise: Promise<ServerlessHandler> | undefined;

async function getHandler(): Promise<ServerlessHandler> {
  handlerPromise ??= (async () => {
    const app = await createNestApp();
    await app.init();
    return serverlessExpress({
      app: app.getHttpAdapter().getInstance(),
    });
  })();
  return handlerPromise;
}

/** Default export for Vercel / serverless hosts. */
export default async function vercelHandler(req: Request, res: Response) {
  const handler = await getHandler();
  return handler(req, res);
}
