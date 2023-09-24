import { User } from '@app/common/entities';
import { omitKeys } from '@app/common/utils';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
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
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        sessions: true,
        createdAt: true,
      },
      {
        sessions: true,
      },
    );
  }

  public async searchUser(q: string) {
    const results = await this.userSearch.search({
      search: q,
      fields: ['firstName', 'lastName'],
    });
    return results?.hits?.hits.map((h) => h._source) ?? [];
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

  public async findOne(id: string) {
    const user = await this.userRepo.findOne(
      { id },
      undefined,
      undefined,
      'User does not exist',
    );
    return omitKeys(user, ['password']);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
