import { UseAuth, User } from '@app/common/decorators';
import { ZodValidationPipe } from '@app/common/pipes';
import { TUser } from '@app/common/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMessageDto, CreateMessageSchema } from './dtos';
import { MessageService } from './message.service';

@Controller('conversation/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseAuth()
  create(
    @User() user: TUser,
    @Body(new ZodValidationPipe(CreateMessageSchema))
    createMessageDto: CreateMessageDto,
  ) {
    return this.messageService.create(user.id, createMessageDto);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: any) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
