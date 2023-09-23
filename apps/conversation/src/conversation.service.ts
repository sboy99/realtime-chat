import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationService {
  create() {
    return 'conversation created';
  }
}
