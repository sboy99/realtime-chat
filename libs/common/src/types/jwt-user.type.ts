import { UserDto } from '../dtos';

export type TJwtUser = Pick<
  UserDto,
  'id' | 'avatar' | 'firstName' | 'lastName'
> & {
  ip?: string;
};
