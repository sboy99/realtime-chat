import { Controller, Get } from '@nestjs/common';
import { FriendService } from './friend.service';

@Controller()
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  getHello(): string {
    return this.friendService.getHello();
  }
}
