import { EXAMPLE_IDS } from './ids';
import type { SwaggerExample } from './types';

export const PublicExamples = {
  publicCarResponse: {
    summary: 'Car visible to QR scanner',
    value: {
      id: EXAMPLE_IDS.carId,
      plate: 'ABC 1234',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'white',
      nickname: 'Daily driver',
      acceptingContact: true,
      owner: {
        firstName: 'Ali',
        phone: '+966501234567',
      },
      methods: ['chat', 'call', 'sms'],
    },
  } satisfies SwaggerExample,

  contactRequest: {
    summary: 'First anonymous message',
    value: {
      text: 'Hello, is your car blocking my driveway?',
      displayName: 'Neighbor',
    },
  } satisfies SwaggerExample,

  contactFollowUpRequest: {
    summary: 'Follow-up with visitor token',
    value: {
      text: 'Still there — please move when you can.',
      visitorToken: EXAMPLE_IDS.visitorToken,
    },
  } satisfies SwaggerExample,

  contactResponse: {
    summary: 'Message accepted',
    value: {
      ok: true,
      chatId: EXAMPLE_IDS.chatId,
      visitorToken: EXAMPLE_IDS.visitorToken,
      messageId: EXAMPLE_IDS.messageId,
      participantLabel: 'Neighbor',
    },
  } satisfies SwaggerExample,

  threadResponse: {
    summary: 'Visitor thread history',
    value: {
      chatId: EXAMPLE_IDS.chatId,
      participantLabel: 'Neighbor',
      messages: [
        {
          id: EXAMPLE_IDS.messageId,
          senderId: 'other',
          text: 'Hello, is your car blocking my driveway?',
          timestamp: 1718870400000,
          status: 'delivered',
        },
      ],
    },
  } satisfies SwaggerExample,

  emptyThreadResponse: {
    summary: 'Unknown visitor token',
    value: {
      messages: [],
      participantLabel: null,
    },
  } satisfies SwaggerExample,

  stickerStatusResponse: {
    summary: 'Sticker linked to a car',
    value: {
      code: EXAMPLE_IDS.stickerCode,
      status: 'assigned',
      carId: EXAMPLE_IDS.carId,
      url: `https://raken-web.vercel.app/c/${EXAMPLE_IDS.stickerCode}`,
    },
  } satisfies SwaggerExample,
} as const;
