import { EXAMPLE_IDS } from './ids';
import type { SwaggerExample } from './types';

export const UsersExamples = {
  updateProfileRequest: {
    summary: 'Update name and phone',
    value: {
      fullName: 'Ali Ahmed Gomaa',
      phone: '+966509876543',
      avatarUrl: 'https://cdn.example.com/avatars/ali.png',
    },
  } satisfies SwaggerExample,

  profileResponse: {
    summary: 'Current user profile',
    value: {
      id: EXAMPLE_IDS.userId,
      fullName: 'Ali Ahmed Gomaa',
      email: 'owner@example.com',
      phone: '+966509876543',
      role: 'owner',
      avatarUrl: 'https://cdn.example.com/avatars/ali.png',
      createdAt: '2026-01-15T10:00:00.000Z',
      updatedAt: '2026-06-20T08:30:00.000Z',
    },
  } satisfies SwaggerExample,
} as const;
