import { TUser } from '@app/common/types';
import { Socket } from 'socket.io';

export interface IAuthSocket extends Socket {
  user?: TUser;
}
