import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

export class AuthUser {
  id!: string;
  email!: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const req = ctx.switchToHttp().getRequest<Request & { user: AuthUser }>();
    return req.user;
  },
);
