import { EXAMPLE_IDS } from './ids';
import type { SwaggerExample } from './types';

export const AuthExamples = {
  registerRequest: {
    summary: 'Register a new car owner',
    value: {
      fullName: 'Ali Ahmed',
      email: 'owner@example.com',
      phone: '+966501234567',
      password: 'secret123',
    },
  } satisfies SwaggerExample,

  loginRequest: {
    summary: 'Login with email and password',
    value: {
      email: 'owner@example.com',
      password: 'secret123',
    },
  } satisfies SwaggerExample,

  sessionResponse: {
    summary: 'JWT session',
    value: {
      token: EXAMPLE_IDS.jwt,
      user: {
        id: EXAMPLE_IDS.userId,
        fullName: 'Ali Ahmed',
        email: 'owner@example.com',
        phone: '+966501234567',
        role: 'owner',
        createdAt: '2026-01-15T10:00:00.000Z',
        updatedAt: '2026-01-15T10:00:00.000Z',
      },
    },
  } satisfies SwaggerExample,
} as const;
