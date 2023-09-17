import { DatabaseModule } from '@app/infra/database';
import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([User])],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
