import { AbstractEntity } from '@app/infra/database';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { Session } from './session.entity';

@Entity('users')
@Unique('unique_email', ['email'])
export class User extends AbstractEntity<User> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ name: 'avatar', type: 'varchar', default: null })
  avatar?: string | null;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isBlocked?: boolean;

  @OneToMany(() => Session, (session) => session.user, { cascade: ['remove'] })
  sessions?: Array<string | Session>;
}
