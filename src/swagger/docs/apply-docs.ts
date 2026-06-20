import { applyDecorators } from '@nestjs/common';

type AnyDecorator =
  | ClassDecorator
  | MethodDecorator
  | PropertyDecorator;

/** Applies one or more Nest/Swagger decorators from a docs module. */
export function applyDocs(...decorators: AnyDecorator[]) {
  return applyDecorators(...decorators);
}
