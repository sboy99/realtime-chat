import { MessagePatterns } from '@app/common/constants';
import { User } from '@app/common/decorators';
import { TUser } from '@app/common/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CanAccess } from '../decorators/can-access';
import { UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  list() {
    return this.userService.listUsers();
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @MessagePattern(MessagePatterns.AUTHENTICATE)
  @CanAccess()
  async getUserProfile(@User() user: TUser) {
    return user;
  }

  @Get('search')
  @CanAccess()
  searchUser(@Query('q') q: string) {
    return this.userService.searchUser(q);
  }

  @MessagePattern(MessagePatterns.USER_LOOKUP)
  lookupUser(@Payload('id', ParseUUIDPipe) userId: string) {
    return this.userService.findOne(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
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
