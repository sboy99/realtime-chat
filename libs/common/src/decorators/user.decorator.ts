import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TJwtUser } from '../types';

export const User = createParamDecorator(
  (
    data: keyof TJwtUser | undefined,
    ctx: ExecutionContext,
  ): TJwtUser | TJwtUser[keyof TJwtUser] => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!data) return request.user as TJwtUser;
    return request?.user?.[data];
  },
);
