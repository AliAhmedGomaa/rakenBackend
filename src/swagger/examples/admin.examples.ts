import { EXAMPLE_IDS } from './ids';
import type { SwaggerExample } from './types';

export const AdminExamples = {
  summaryResponse: {
    summary: 'Platform-wide stats',
    value: {
      users: { owners: 42, admins: 1 },
      cars: { total: 58 },
      chats: { total: 120, unreadMessages: 15 },
      stickers: { total: 200, assigned: 58, unassigned: 142 },
      recentOwners: [
        {
          id: EXAMPLE_IDS.userId,
          fullName: 'Ali Ahmed',
          email: 'owner@example.com',
          role: 'owner',
          createdAt: '2026-01-15T10:00:00.000Z',
        },
      ],
    },
  } satisfies SwaggerExample,

  usersListResponse: {
    summary: 'All owners',
    value: [
      {
        id: EXAMPLE_IDS.userId,
        fullName: 'Ali Ahmed',
        email: 'owner@example.com',
        role: 'owner',
        carsCount: 2,
        createdAt: '2026-01-15T10:00:00.000Z',
      },
    ],
  } satisfies SwaggerExample,

  updateCarRequest: {
    summary: 'Admin edits a car plate',
    value: {
      plate: 'XYZ 9876',
      status: 'active',
    },
  } satisfies SwaggerExample,

  batchStickersRequest: {
    summary: 'Generate printable stickers',
    value: { count: 50 },
  } satisfies SwaggerExample,

  batchStickersResponse: {
    summary: 'New sticker batch',
    value: {
      count: 50,
      stickers: [
        {
          code: EXAMPLE_IDS.stickerCode,
          status: 'unassigned',
          url: `https://raken-web.vercel.app/c/${EXAMPLE_IDS.stickerCode}`,
        },
      ],
    },
  } satisfies SwaggerExample,

  deleteResponse: {
    summary: 'Resource removed',
    value: { ok: true },
  } satisfies SwaggerExample,

  createAdminRequest: {
    summary: 'Create a new admin account',
    value: {
      fullName: 'Raken Admin',
      email: 'new-admin@raken.app',
      phone: '+966501111111',
      password: 'secureAdminPass123',
    },
  } satisfies SwaggerExample,

  createAdminResponse: {
    summary: 'Admin account created',
    value: {
      user: {
        id: EXAMPLE_IDS.adminId,
        fullName: 'Raken Admin',
        email: 'new-admin@raken.app',
        phone: '+966501111111',
        role: 'admin',
        createdAt: '2026-06-20T12:00:00.000Z',
        updatedAt: '2026-06-20T12:00:00.000Z',
      },
    },
  } satisfies SwaggerExample,
} as const;
