import { AbstractEntity } from '@app/infra/database';
import { Column, Entity } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity()
export class User extends AbstractEntity<User> implements CreateUserDto {
  @Column()
  email: string;

  @Column()
  password: string;
}
