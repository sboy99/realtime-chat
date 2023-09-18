import { User } from '@app/common/entities';
import { AbstractEntity } from '@app/infra/database';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

@Entity('sessions')
@Unique('unique_device', ['ip', 'userDevice'])
export class Session extends AbstractEntity<Session> {
  @Column()
  ip: string;

  @Column()
  userAgent: string;

  @Column()
  userDevice: string;

  @Column({ default: false })
  isBlocked?: boolean;

  @ManyToOne(() => User, (user) => user.sessions)
  user: string | User;

  //   todo: refresh token
}
