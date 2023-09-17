import { User } from '@app/common/entities';
import { AbstractEntity } from '@app/infra/database';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique('unique_device', ['ip', 'userDevice'])
export class Session extends AbstractEntity<Session> {
  @Column({ name: 'ip' })
  ip: string;

  @Column({ name: 'user_agent' })
  userAgent: string;

  @Column({ name: 'user_device' })
  userDevice: string;

  @Column({ name: 'is_blocked', default: false })
  isBlocked?: boolean;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  //   todo: refresh token
}
