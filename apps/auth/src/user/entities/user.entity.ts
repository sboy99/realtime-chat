import { AbstractEntity } from '@app/infra/database';
import { Column, Entity, Unique } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity()
@Unique('unique_email', ['email'])
export class User extends AbstractEntity<User> implements CreateUserDto {
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
}
