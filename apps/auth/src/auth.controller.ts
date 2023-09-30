import { Routes } from '@app/common/constants';
import { ZodValidationPipe } from '@app/common/pipes';
import { TApiResponse } from '@app/common/types';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { CreateUserDto, CreateUserSchema } from './user/dto';

@Controller(Routes.AUTH.DEFAULT)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post(Routes.AUTH.REGISTER)
  async register(
    @Body(new ZodValidationPipe(CreateUserSchema)) createUserDto: CreateUserDto,
  ): TApiResponse {
    await this.authService.register(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
    };
  }

  @Post(Routes.AUTH.LOGIN)
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) loginDto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ): TApiResponse<{ accessToken: string }> {
    // Verify login credentials
    const user = await this.authService.login(loginDto, ip, userAgent);
    // Generate access token
    const accessToken = await this.authService.generateAccessToken(user);
    // return response
    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      data: { accessToken },
    };
  }
}
