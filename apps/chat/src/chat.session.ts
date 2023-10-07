import { Injectable } from '@nestjs/common';
import { IAuthSocket } from './interfaces';

export interface IChatSessionManager {
  getUserSocket(id: string): IAuthSocket[];
  setUserSocket(id: string, socket: IAuthSocket): void;
  removeUserSocket(id: string, socket: IAuthSocket): void;
  getSockets(): Map<string, IAuthSocket[]>;
}

@Injectable()
export class ChatSessionManager implements IChatSessionManager {
  private readonly sessions: Map<string, IAuthSocket[]> = new Map();

  getUserSocket(id: string) {
    return this.sessions.get(id) || [];
  }

  setUserSocket(id: string, socket: IAuthSocket): void {
    const existingSockets = this.sessions.get(id) || [];
    this.sessions.set(id, [...existingSockets, socket]);
  }

  removeUserSocket(id: string, socket: IAuthSocket): void {
    const existingSockets = this.sessions.get(id);
    if (!existingSockets) return;

    const sockets = existingSockets.filter((s) => s.id !== socket.id);

    if (!sockets.length) {
      this.sessions.delete(id);
    } else {
      this.sessions.set(id, sockets);
    }
  }

  getSockets(): Map<string, IAuthSocket[]> {
    return this.sessions;
  }
}
