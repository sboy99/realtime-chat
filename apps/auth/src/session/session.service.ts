import { Session } from '@app/common/entities';
import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepo: SessionRepository) {}

  public create(createSessionDto: CreateSessionDto) {
    const session = new Session(createSessionDto);
    return this.sessionRepo.upsert(session, {
      conflictPaths: {
        ip: true,
        userDevice: true,
      },
      skipUpdateIfNoValuesChanged: true,
      upsertType: 'on-conflict-do-update',
    });
  }
}
