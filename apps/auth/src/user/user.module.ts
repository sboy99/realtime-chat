import { DatabaseModule } from '@app/infra/database';
import { Module } from '@nestjs/common';
import { User } from '../../../../libs/common/src/entities/user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';

@Module({
  imports: [DatabaseModule.forFeature([User])],
  providers: [UserService, UserSubscriber, UserRepository],
  exports: [UserService],
})
export class UserModule {}
