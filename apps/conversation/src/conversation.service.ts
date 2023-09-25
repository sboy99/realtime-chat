import { MessagePatterns, MicroServices } from '@app/common/constants';
import { Conversation, User } from '@app/common/entities';
import { TUser } from '@app/common/types';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';
import { ConversationRepository } from './conversation.repository';

@Injectable()
export class ConversationService {
  constructor(
    @Inject(MicroServices.AUTH_CLIENT) private readonly authClient: ClientProxy,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async create(params: { user: TUser; friendId: string }) {
    const { user, friendId } = params;
    // if both userId and friendId are saame throw an exception
    if (user.id === friendId)
      throw new BadRequestException('Cannot create conversation with self');

    // check conversation existence
    const hasConversationAlready =
      await this.conversationRepository.conversationExists(user.id, friendId);
    if (hasConversationAlready)
      throw new BadRequestException('Conversation already exists');

    // find friend id exist or not
    return this.authClient
      .send<TUser, { id: string }>(MessagePatterns.USER_LOOKUP, {
        id: friendId,
      })
      .pipe(
        map(async (friend) => {
          const conversation = new Conversation({
            creator: user as User,
            recipient: friend as User,
          });
          return this.conversationRepository.create(conversation);
        }),
        catchError(() => {
          throw new NotFoundException('Friend does not exist');
        }),
      );
  }

  async findUserConversations(userId: string) {
    const conversations =
      await this.conversationRepository.findUserConversations(userId);
    return conversations.map((c) => {
      return {
        id: c.id,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        messages: c.messages,
        with: c.creator.id === userId ? c.recipient : c.creator,
      };
    });
  }
}
