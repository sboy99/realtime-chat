import { TJwtUser } from '@app/common/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TAuthEnv } from '../env';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(configService: ConfigService<TAuthEnv>) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(req: Request, payload: TJwtUser): TJwtUser {
    return {
      ...payload,
      ip: req.ip,
    };
  }
}
