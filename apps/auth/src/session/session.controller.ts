import { MessagePatterns } from '@app/common/constants';
import { ZodValidationPipe } from '@app/common/pipes';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateSessionDto,
  CreateSessionSchema,
} from './dto/create-session.dto';

@Controller('session')
export class SessionController {
  @MessagePattern(MessagePatterns.USER_LOGIN)
  createUserSession(
    @Payload(new ZodValidationPipe(CreateSessionSchema))
    createSessionDto: CreateSessionDto,
  ): void {
    console.log(createSessionDto);
  }
}
