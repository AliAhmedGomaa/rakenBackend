import { EXAMPLE_IDS } from './ids';
import type { SwaggerExample } from './types';

export const DashboardExamples = {
  summaryResponse: {
    summary: 'Owner dashboard overview',
    value: {
      cars: { total: 2, active: 1, paused: 1 },
      chats: { total: 5, unreadThreads: 2, unreadMessages: 3 },
      recentChats: [
        {
          id: EXAMPLE_IDS.chatId,
          carPlate: 'ABC 1234',
          participantLabel: 'Neighbor #1',
          unreadCount: 1,
          contactMethod: 'chat',
          createdAt: '2026-06-20T10:00:00.000Z',
          updatedAt: '2026-06-20T10:05:00.000Z',
        },
      ],
    },
  } satisfies SwaggerExample,
} as const;
