import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';

export type TFn<T = void> = () => T | Promise<T>;

@Injectable()
export class RedisService {
  private _redisClient: RedisClientType;
  protected logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {
    this.initRedisClient();
    this.enableRedisErrorHook();
  }

  private initRedisClient() {
    this._redisClient = createClient({
      url: this.configService.getOrThrow<string>('REDIS_URI'),
    });
  }

  private enableRedisErrorHook() {
    this._redisClient.on('error', (err) => this.handleRedisError(err));
  }

  private handleRedisError(err: unknown) {
    this.logger.error('Redis error occurred', err);
  }

  private withRedisWrapper = async <T>(fn: TFn<T>): Promise<T | undefined> => {
    try {
      await this._redisClient.connect();
      return fn();
    } catch (error) {
      this.handleRedisError(error);
    } finally {
      await this._redisClient.quit();
    }
  };

  public setHash = (hash: string, payload: any) => {
    return this.withRedisWrapper(async () => {
      await this._redisClient.hSet(hash, payload);
    });
  };

  public getHash = (hash: string) => {
    return this.withRedisWrapper(async () => {
      return this._redisClient.hGetAll(hash);
    });
  };
}
