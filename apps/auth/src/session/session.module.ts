import { Session } from '@app/common/entities/session.entity';
import { DatabaseModule } from '@app/infra/database';
import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

@Module({
  imports: [DatabaseModule.forFeature([Session])],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
})
export class SessionModule {}
