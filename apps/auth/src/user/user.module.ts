import { User } from '@app/common/entities';
import { DatabaseModule } from '@app/infra/database';
import { SearchModule } from '@app/infra/search';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserSearch } from './user.search';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';

@Module({
  imports: [DatabaseModule.forFeature([User]), SearchModule],
  controllers: [UserController],
  providers: [UserService, UserSubscriber, UserSearch, UserRepository],
  exports: [UserService],
})
export class UserModule {}
