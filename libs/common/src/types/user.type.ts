import { User } from '../entities';

export type TUser = Omit<User, 'password'> & {
  ip?: string;
};
