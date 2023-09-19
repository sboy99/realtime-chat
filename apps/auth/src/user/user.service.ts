import { User } from '@app/common/entities';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, SearchUserDto, UpdateUserDto } from './dto';
import { UserRepository } from './user.repository';
import { UserSearch } from './user.search';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userSearch: UserSearch,
  ) {}

  public async getUserProfile(userId: string) {
    return await this.userRepo.findOne(
      { id: userId },
      {
        sessions: true,
      },
    );
  }

  public async searchUser(searchQuery: SearchUserDto) {
    return this.userSearch.searchIndex(searchQuery);
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
