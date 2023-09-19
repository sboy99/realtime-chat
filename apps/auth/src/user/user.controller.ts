import { User } from '@app/common/decorators';
import { ZodValidationPipe } from '@app/common/pipes';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CanAccess } from '../decorators/can-access';
import { SearchUserDto, SearchUserSchema, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  list() {
    return this.userService.listUsers();
  }

  @Get('profile')
  @CanAccess()
  getUserProfile(@User('id', ParseUUIDPipe) userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @Post('search')
  @CanAccess()
  searchUser(
    @Body(new ZodValidationPipe(SearchUserSchema)) searchUserDto: SearchUserDto,
  ) {
    return this.userService.searchUser(searchUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
