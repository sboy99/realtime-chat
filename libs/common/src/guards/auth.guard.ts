import { MessagePatterns, MicroServices } from '@app/common/constants';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, tap } from 'rxjs';
import { IRequest } from '../interfaces';
import { TUser } from '../types';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(MicroServices.AUTH_CLIENT) private readonly authClient: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<IRequest>();

    // reject if no token
    const bearerToken = req.headers?.['authorization'];
    if (!bearerToken)
      throw new UnauthorizedException('Authorization token is required');

    // send auth microservice authenticate request
    return this.authClient
      .send<TUser>(MessagePatterns.AUTHENTICATE, { bearerToken })
      .pipe(
        tap((user) => (req.user = user)),
        map(() => true),
        catchError(() => {
          throw new UnauthorizedException('Invalid token');
        }),
      );
  }
}
