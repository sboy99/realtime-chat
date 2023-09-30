import { AbstractEntity } from '@app/infra/database';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { Session } from './session.entity';

@Entity('users')
@Unique('unique_email', ['email'])
export class User extends AbstractEntity<User> {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'avatar', type: 'varchar', default: null })
  avatar?: string | null;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'is_blocked', default: false })
  isBlocked?: boolean;

  @OneToMany(() => Session, (session) => session.user, { cascade: ['remove'] })
  sessions?: Array<string | Session>;
}
