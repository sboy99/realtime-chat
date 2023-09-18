import { Injectable } from '@nestjs/common';
import { User } from '../../../../libs/common/src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  public async getUserProfile(userId: string) {
    return await this.userRepo.findOne(
      { id: userId },
      {
        sessions: true,
      },
    );
  }

  public async create(createUserDto: CreateUserDto) {
    // check if user already exists
    await this.userRepo.checkUnique({
      email: createUserDto.email,
    });

    // create user
    const user = new User(createUserDto);
    return this.userRepo.create(user);
  }

  listUsers() {
    return `This action returns all user`;
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ email });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
