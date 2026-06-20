import { EXAMPLE_IDS } from './ids';
import type { SwaggerExample } from './types';

const chat = {
  id: EXAMPLE_IDS.chatId,
  ownerId: EXAMPLE_IDS.userId,
  carId: EXAMPLE_IDS.carId,
  carPlate: 'ABC 1234',
  participantLabel: 'Neighbor #1',
  contactMethod: 'chat',
  unreadCount: 1,
  messages: [
    {
      id: EXAMPLE_IDS.messageId,
      senderId: 'other',
      text: 'Your car is blocking my driveway.',
      timestamp: 1718870400000,
      status: 'delivered',
    },
  ],
  createdAt: '2026-06-20T10:00:00.000Z',
  updatedAt: '2026-06-20T10:05:00.000Z',
};

export const ChatsExamples = {
  startRequest: {
    summary: 'Start a chat thread for a car',
    value: {
      carId: EXAMPLE_IDS.carId,
      participantLabel: 'Neighbor #1',
      contactMethod: 'chat',
      initialMessage: 'Hello, is this your car?',
    },
  } satisfies SwaggerExample,

  sendMessageRequest: {
    summary: 'Owner reply',
    value: {
      text: 'Sorry — moving it now.',
    },
  } satisfies SwaggerExample,

  chatResponse: {
    summary: 'Single chat thread',
    value: chat,
  } satisfies SwaggerExample,

  listResponse: {
    summary: 'All owner chats',
    value: [chat],
  } satisfies SwaggerExample,

  markReadResponse: {
    summary: 'Thread marked read',
    value: { ok: true, unreadCount: 0 },
  } satisfies SwaggerExample,

  deleteResponse: {
    summary: 'Chat deleted',
    value: { ok: true },
  } satisfies SwaggerExample,
} as const;
