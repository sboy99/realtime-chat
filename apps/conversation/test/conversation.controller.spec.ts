import { Test, TestingModule } from '@nestjs/testing';
import { ConversationController } from '../src/controllers/conversation.http-controller';
import { ConversationService } from '../src/conversation.service';

describe('ConversationController', () => {
  let conversationController: ConversationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [ConversationService],
    }).compile();

    conversationController = app.get<ConversationController>(
      ConversationController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(conversationController.getHello()).toBe('Hello World!');
    });
  });
});
