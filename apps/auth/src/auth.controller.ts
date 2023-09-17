import { ZodValidationPipe } from '@app/common/pipes';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserSchema } from './user/dto/create-user.dto';
import { UserService } from './user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(CreateUserSchema)) createUserDto: CreateUserDto,
  ) {
    const registeredUser = await this.userService.create(createUserDto);
    return registeredUser;
  }
}
