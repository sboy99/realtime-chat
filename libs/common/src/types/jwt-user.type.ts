import { UserDto } from '../dto';

export type TJwtUser = Pick<
  UserDto,
  'id' | 'avatar' | 'firstName' | 'lastName'
> & {
  ip?: string;
};
