import { MessagePatterns, MicroServices } from '@app/common/constants';
import { User } from '@app/common/entities';
import { TJwtUser } from '@app/common/types';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcryptjs from 'bcryptjs';
import { parse as getUserAgent } from 'express-useragent';
import { LoginDto } from './dto/login.dto';
import { TAuthEnv } from './env';
import { CreateSessionDto } from './session/dto/create-session.dto';
import { CreateUserDto } from './user/dto';
import { UserService } from './user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<TAuthEnv>,
    @Inject(MicroServices.AUTH_CLIENT) private readonly authClient: ClientProxy,
  ) {}

  public async register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  public async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const user = await this.userService.findByEmail(loginDto.email);
    await this.verifyPassword(loginDto.password, user.password);

    // if valid user create session
    this.authClient.emit<any, CreateSessionDto>(MessagePatterns.USER_LOGIN, {
      ip,
      userAgent,
      user,
      userDevice: this.getUserDevice(userAgent),
    });

    return user;
  }

  public async generateAccessToken(user: User) {
    const userPayload = this.getUserJwtPayload(user);
    return this.jwtService.signAsync(userPayload, {
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_ACCESS_TOKEN_EXPIRY',
      ),
    });
  }

  private async verifyPassword(pass: string, hash: string): Promise<true> {
    const isMatch = await bcryptjs.compare(pass, hash);
    if (!isMatch) throw new BadRequestException(`Invalid credentials`);
    return true;
  }

  private getUserDevice(userAgent: string): string {
    // Get human readable user agent from user agent
    const ua = getUserAgent(userAgent);
    const deviceTypeField = Object.keys(ua).find((field) => !!ua[field]);
    const deviceType = !!deviceTypeField
      ? deviceTypeField.replace('is', '')
      : 'unknown';

    return `${deviceType}, ${ua.browser} on ${ua.os}`;
  }

  private getUserJwtPayload(user: User): TJwtUser {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };
  }
}
