import { Session } from '@app/common/entities/session.entity';
import { DatabaseModule } from '@app/infra/database';
import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [DatabaseModule.forFeature([Session])],
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
