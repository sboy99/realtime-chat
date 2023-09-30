import { User } from '@app/common/entities';
import { AbstractEntity } from '@app/infra/database';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity('sessions')
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
  @JoinColumn({ name: 'user_id' })
  user: string | User;

  //   todo: refresh token
}
