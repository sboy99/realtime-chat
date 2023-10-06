import { Session } from '@app/common/entities';
import { IRequest } from '@app/common/interfaces';
import { TJwtUser, TUser } from '@app/common/types';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TAuthEnv } from '../env';
import { UserService } from '../user/user.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    configService: ConfigService<TAuthEnv>,
    private readonly userService: UserService,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: IRequest) => {
          const bearertoken =
            req?.headers?.['authorization'] || req?.bearerToken;

          if (!bearertoken) throw new ForbiddenException('Access Denied');
          return bearertoken.split(' ')?.[1];
        },
      ]),
    });
  }

  async validate(req: Request, payload: TJwtUser): Promise<TUser> {
    const user = await this.userService.getUserProfile(payload.id);
    // if user is blocked
    if (!!user.isBlocked) throw new ForbiddenException('User is blocked');

    // select device session
    user.sessions =
      user.sessions?.filter((session) => (session as Session).ip) || [];

    return {
      ...user,
      ip: req.ip,
    };
  }
}
