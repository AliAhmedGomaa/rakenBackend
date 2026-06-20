import { EXAMPLE_IDS } from './ids';
import type { SwaggerExample } from './types';

export const QrStickersExamples = {
  lookupResponse: {
    summary: 'Unassigned sticker ready to link',
    value: {
      code: EXAMPLE_IDS.stickerCode,
      status: 'unassigned',
      url: `https://raken-web.vercel.app/c/${EXAMPLE_IDS.stickerCode}`,
    },
  } satisfies SwaggerExample,

  batchRequest: {
    summary: 'Generate 100 stickers',
    value: { count: 100 },
  } satisfies SwaggerExample,

  batchResponse: {
    summary: 'Batch generation result',
    value: {
      count: 100,
      stickers: [
        {
          code: EXAMPLE_IDS.stickerCode,
          status: 'unassigned',
          url: `https://raken-web.vercel.app/c/${EXAMPLE_IDS.stickerCode}`,
          dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        },
      ],
    },
  } satisfies SwaggerExample,
} as const;
