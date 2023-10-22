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
  /**
   * Creates an instance of the ChatGateway class.
   * @param {INestApplicationContext} app - The Nest.js application context.
   * @param {ConfigService<TChatEnv>} configService - The configuration service for chat-related environment variables.
   * @constructor
   */
  constructor(
    private readonly app: INestApplicationContext,
    private readonly configService: ConfigService<TChatEnv>,
  ) {
    super(app);
    this.authClient = this.app?.get<ClientProxy>(MicroServices.AUTH_CLIENT);
    this.chatSessionManager =
      this.app?.get<ChatSessionManager>(ChatSessionManager);
  }

  /**
   * Establish a connection to Redis using the provided configuration and set up
   * a Redis adapter for pub/sub messaging.
   *
   * @async
   * @function connectToRedis
   * @returns {Promise<void>}
   * @throws {Error} If there is an issue connecting to Redis.
   */
  async connectToRedis(): Promise<void> {
    try {
      // Create a Redis pub client with the specified URL.
      const pubClient = createClient({
        url: this.configService.getOrThrow<string>('REDIS_URI'),
      });

      // Duplicate the pub client to create a separate sub client.
      const subClient = pubClient.duplicate();

      // Connect to both pub and sub clients simultaneously using Promise.all.
      await Promise.all([pubClient.connect(), subClient.connect()]);

      // Create a Redis adapter for pub/sub messaging.
      this.adapterConstructor = createAdapter(pubClient, subClient);
    } catch (error) {
      // Handle any connection errors and throw an exception.
      throw new Error(`Failed to connect to Redis: ${error.message}`);
    }
  }
  /**
   * Verify the authentication of a socket connection by checking the provided authorization token.
   *
   * @param {IAuthSocket} socket - The socket connection object.
   * @param {Function} next - The function to call to proceed with the connection or handle an error.
   *
   * @throws {UnauthorizedException} If no access token is provided or if the authentication token is invalid.
   */
  private verifyAuthentication = (socket: IAuthSocket, next: any) => {
    /**
     * The authorization token from the socket handshake headers.
     */
    const authToken = socket.handshake.headers?.['authorization'];
    /**
     * Throw an error if not access token found
     */
    if (!authToken) next(new UnauthorizedException('Provide access token'));

    /**
     * Take client service and verify authentication token
     */
    this.authClient
      .send<TUser, { bearerToken?: string }>(MessagePatterns.AUTHENTICATE, {
        bearerToken: authToken,
      })
      .pipe(
        /**
         * Set the user property on the socket if authentication is successful.
         * @param {TUser} u - The user object.
         */
        tap((u) => (socket.user = u)),
        /**
         * Map the result to 'true' to indicate successful authentication.
         */
        map(() => true),
        /**
         * Catch errors and call the 'next' function with an UnauthorizedException if authentication fails.
         * @param {Error} error - The authentication error.
         */
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

  /**
   * Create an instance of the IO server for handling WebSocket connections.
   *
   * @param {number} port - The port on which the server will listen for WebSocket connections.
   * @param {ServerOptions} [options] - Optional server configuration options.
   * @returns {any} An instance of the created IO server.
   */
  createIOServer(port: number, options?: ServerOptions): any {
    /**
     * Create an instance of the IO server using the provided port and options.
     */
    const server = super.createIOServer(port, options);
    /**
     * Set the server's adapter to the specified adapter constructor.
     */
    server.adapter(this.adapterConstructor);
    /**
     * Attach the authentication verification middleware to the server.
     */
    server.use(this.verifyAuthentication);
    /**
     * Return the created IO server.
     */
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
