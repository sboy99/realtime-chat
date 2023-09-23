import { Routes } from '@app/common/constants';
import { ZodValidationPipe } from '@app/common/pipes';
import { Body, Controller, Headers, Ip, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { CreateUserDto, CreateUserSchema } from './user/dto';

@Controller(Routes.AUTH.DEFAULT)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(Routes.AUTH.REGISTER)
  async register(
    @Body(new ZodValidationPipe(CreateUserSchema)) createUserDto: CreateUserDto,
  ) {
    const registeredUser = await this.authService.register(createUserDto);
    return registeredUser;
  }

  @Post(Routes.AUTH.LOGIN)
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) loginDto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    // Verify login credentials
    const user = await this.authService.login(loginDto, ip, userAgent);
    // Generate access token
    const accessToken = await this.authService.generateAccessToken(user);
    // return response
    return { accessToken };
  }
}
