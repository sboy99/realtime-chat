import { TUser } from '@app/common/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthSocket } from '../interfaces';

export const SocketUser = createParamDecorator(
  (
    data: keyof TUser | undefined,
    ctx: ExecutionContext,
  ): TUser | TUser[keyof TUser] => {
    const client = ctx.switchToWs().getClient<IAuthSocket>();
    if (!data) return client?.user;
    return client?.user?.[data];
  },
);
