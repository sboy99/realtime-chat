import { UserPropulateSelects } from '@app/common/constants';
import { Conversation } from '@app/common/entities';
import { mapSelects } from '@app/common/utils';
import { AbstractRepository } from '@app/infra/database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ConversationRepository extends AbstractRepository<Conversation> {
  protected readonly logger = new Logger(ConversationRepository.name);

  constructor(
    @InjectRepository(Conversation)
    entityRepository: Repository<Conversation>,
    entityManager: EntityManager,
  ) {
    super(entityRepository, entityManager);
  }
  /**
   * The function `findUserConversations` retrieves a list of conversations for a given user, including
   * the creator and recipient of each conversation.
   * @param {string} userId - The `userId` parameter is a string that represents the ID of a user.
   * @returns an array of conversations that match the given userId. Each conversation object in the
   * array will have the creator and recipient properties populated with additional user information.
   * The function is also limiting the result to a maximum of 2 conversations.
   */
  findUserConversations(userId: string) {
    return this.entityRepository
      .createQueryBuilder('conversations')
      .leftJoin('conversations.creator', 'creator')
      .addSelect(mapSelects('creator', UserPropulateSelects))
      .leftJoin('conversations.recipient', 'recipient')
      .addSelect(mapSelects('recipient', UserPropulateSelects))
      .where(
        'conversations.creator = :creatorId OR conversations.recipient = :recipientId',
        { creatorId: userId, recipientId: userId },
      )
      .take(2)
      .getMany();
  }
  /**
   * The function checks if a conversation exists between two users.
   * @param {string} userId - The `userId` parameter represents the ID of the user for whom we want to
   * check if a conversation exists.
   * @param {string} friendId - The `friendId` parameter is the identifier of the friend with whom the
   * conversation is being checked.
   * @returns the result of the `exist` method called on the `entityRepository`.
   */
  conversationExists(userId: string, friendId: string) {
    return this.entityRepository.exist({
      where: {
        creator: {
          id: userId,
        },
        recipient: {
          id: friendId,
        },
      },
    });
  }
  /**
   * The function looks up a user's conversation by their ID and the conversation ID, checking if the
   * conversation exists and if the user is either the creator or recipient of the conversation.
   * @param {string} userId - The `userId` parameter is a string that represents the ID of the user
   * whose conversation is being looked up.
   * @param {string} conversationId - The `conversationId` parameter is the unique identifier of the
   * conversation you want to look up. It is used to filter the conversations in the query and retrieve
   * the specific conversation with the matching ID.
   * @returns the result of the query, which is a boolean value indicating whether a conversation exists
   * for the given user ID and conversation ID.
   */
  lookupUserConversation(userId: string, conversationId: string) {
    return this.entityRepository
      .createQueryBuilder('conversations')
      .leftJoin('conversations.creator', 'creator')
      .leftJoin('conversations.recipient', 'recipient')
      .where(
        'conversations.id = :conversationId AND (creator.id = :creatorId OR recipient.id = :recipientId)',
        {
          conversationId,
          creatorId: userId,
          recipientId: userId,
        },
      )
      .getExists();
  }
}
