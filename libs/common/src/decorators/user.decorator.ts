import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequest } from '../interfaces';
import { TUser } from '../types';

export const User = createParamDecorator(
  (
    data: keyof TUser | undefined,
    ctx: ExecutionContext,
  ): TUser | TUser[keyof TUser] => {
    const request = ctx.switchToHttp().getRequest<IRequest>();
    if (!data) return request.user as TUser;
    return request?.user?.[data];
  },
);
