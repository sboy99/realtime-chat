import { MessagePatterns, MicroServices } from '@app/common/constants';
import { TUser } from '@app/common/types';
import {
  INestApplicationContext,
  UnauthorizedException,
  WebSocketAdapter,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { catchError, map, tap } from 'rxjs';
import { Server, ServerOptions } from 'socket.io';
import { ChatSessionManager } from '../chat.session';
import { TChatEnv } from '../env';
import { IAuthSocket } from '../interfaces';

export class RedisIoAdapter extends IoAdapter implements WebSocketAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private authClient: ClientProxy;
  private chatSessionManager: ChatSessionManager;

  constructor(
    private readonly app: INestApplicationContext,
    private readonly configService: ConfigService<TChatEnv>,
  ) {
    super(app);
    this.authClient = this.app?.get<ClientProxy>(MicroServices.AUTH_CLIENT);
    this.chatSessionManager =
      this.app?.get<ChatSessionManager>(ChatSessionManager);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: this.configService.getOrThrow<string>('REDIS_URI'),
    });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  private verifyAuthentication = (socket: IAuthSocket, next: any) => {
    const authToken = socket.handshake.headers?.['authorization'];

    // throw an error if not access token found
    if (!authToken) next(new UnauthorizedException('Provide access token'));

    // take client service and verify authentication token
    this.authClient
      .send<TUser, { bearerToken?: string }>(MessagePatterns.AUTHENTICATE, {
        bearerToken: authToken,
      })
      .pipe(
        tap((u) => (socket.user = u)),
        map(() => true),
        catchError(() => {
          return next(
            new UnauthorizedException('Invalid authentication token'),
          );
        }),
      )
      .subscribe(() => {
        next();
      });
  };

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    server.use(this.verifyAuthentication);

    return server;
  }

  public bindClientConnect = (
    server: Server,
    callback: (socket: IAuthSocket) => void,
  ) => {
    server.on('connection', (socket: IAuthSocket) => {
      if (!!socket?.user?.id) {
        this.chatSessionManager.setUserSocket(socket?.user?.id, socket);

        socket.on('disconnect', () => {
          this.chatSessionManager.removeUserSocket(
            socket?.user?.id as string,
            socket,
          );
        });
      }

      callback(socket);
    });
  };
}
