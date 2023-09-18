import { MessagePatterns } from '@app/common/constants';
import { ZodValidationPipe } from '@app/common/pipes';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateSessionDto,
  CreateSessionSchema,
} from './dto/create-session.dto';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @MessagePattern(MessagePatterns.USER_LOGIN)
  async createUserSession(
    @Payload(new ZodValidationPipe(CreateSessionSchema))
    createSessionDto: CreateSessionDto,
  ): Promise<void> {
    await this.sessionService.create(createSessionDto);
  }
}
