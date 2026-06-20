import type { IncomingMessage, ServerResponse } from 'node:http';
import { createNestApp } from './create-app';

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

let cachedHandler: Handler | undefined;

async function getHandler(): Promise<Handler> {
  if (!cachedHandler) {
    const app = await createNestApp();
    await app.init();
    cachedHandler = app.getHttpAdapter().getInstance() as Handler;
  }
  return cachedHandler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const h = await getHandler();
  h(req, res);
}
