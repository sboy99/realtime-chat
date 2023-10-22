import { Injectable } from '@nestjs/common';
import { IAuthSocket } from './interfaces';

export interface IChatSessionManager {
  getUserSocket(userId: string): IAuthSocket[];
  setUserSocket(userId: string, socket: IAuthSocket): void;
  removeUserSocket(userId: string, socket: IAuthSocket): void;
  getSockets(): Map<string, IAuthSocket[]>;
}

@Injectable()
export class ChatSessionManager implements IChatSessionManager {
  private readonly sessions: Map<string, IAuthSocket[]> = new Map();

  getUserSocket(userId: string) {
    return this.sessions.get(userId) || [];
  }

  setUserSocket(userId: string, socket: IAuthSocket): void {
    const existingSockets = this.sessions.get(userId) || [];
    this.sessions.set(userId, [...existingSockets, socket]);
  }

  removeUserSocket(userId: string, socket: IAuthSocket): void {
    const existingSockets = this.sessions.get(userId);
    if (!existingSockets) return;

    const sockets = existingSockets.filter((s) => s.id !== socket.id);

    if (!sockets.length) {
      this.sessions.delete(userId);
    } else {
      this.sessions.set(userId, sockets);
    }
  }

  getSockets(): Map<string, IAuthSocket[]> {
    return this.sessions;
  }
}
