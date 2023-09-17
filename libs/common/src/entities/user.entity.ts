import { AbstractEntity } from '@app/infra/database';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { Session } from './session.entity';

@Entity()
@Unique('unique_email', ['email'])
export class User extends AbstractEntity<User> {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'avatar', default: null })
  avatar?: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions?: Session[];
}
