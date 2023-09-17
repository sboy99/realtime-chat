import { MessagePatterns, Services } from '@app/common/constants';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { CreateSessionDto } from './session/dto/create-session.dto';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UserService } from './user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(Services.AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  public async register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  public async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const user = await this.userService.findByEmail(loginDto.email);
    await this.verifyPassword(loginDto.password, user.password);

    // if valid user
    // > create session
    this.authClient.emit<any, CreateSessionDto>(MessagePatterns.USER_LOGIN, {
      ip,
      userAgent,
      user,
      userDevice: this.getUserDevice(userAgent),
    });

    return user;
  }

  private async verifyPassword(pass: string, hash: string): Promise<true> {
    const isMatch = await bcryptjs.compare(pass, hash);
    if (!isMatch) throw new BadRequestException(`Invalid credentials`);
    return true;
  }

  private getUserDevice(userAgent: string): string {
    //
    return userAgent;
  }
}
