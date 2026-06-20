import { EXAMPLE_IDS } from './ids';
import type { SwaggerExample } from './types';

const car = {
  id: EXAMPLE_IDS.carId,
  ownerId: EXAMPLE_IDS.userId,
  plate: 'ABC 1234',
  make: 'Toyota',
  model: 'Camry',
  year: 2022,
  color: 'white',
  nickname: 'Daily driver',
  status: 'active',
  createdAt: '2026-02-01T09:00:00.000Z',
  updatedAt: '2026-02-01T09:00:00.000Z',
};

export const CarsExamples = {
  createRequest: {
    summary: 'Register a car with a scanned sticker',
    value: {
      plate: 'ABC 1234',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'white',
      nickname: 'Daily driver',
      status: 'active',
      qrCode: EXAMPLE_IDS.stickerCode,
    },
  } satisfies SwaggerExample,

  updateRequest: {
    summary: 'Pause contact for a car',
    value: {
      status: 'paused',
      nickname: 'Weekend car',
    },
  } satisfies SwaggerExample,

  carResponse: {
    summary: 'Single car',
    value: car,
  } satisfies SwaggerExample,

  listResponse: {
    summary: 'Owner cars list',
    value: [car],
  } satisfies SwaggerExample,

  qrResponse: {
    summary: 'QR deep link and image',
    value: {
      carId: EXAMPLE_IDS.carId,
      plate: 'ABC 1234',
      url: `https://raken-web.vercel.app/c/${EXAMPLE_IDS.stickerCode}`,
      dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    },
  } satisfies SwaggerExample,

  deleteResponse: {
    summary: 'Car removed',
    value: { ok: true },
  } satisfies SwaggerExample,
} as const;
