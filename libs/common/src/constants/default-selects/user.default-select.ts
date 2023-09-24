import { User } from '@app/common/entities';
import { getSelects } from '@app/common/utils';

export const UserDefaultSelects = getSelects<User>(
  'id',
  'firstName',
  'lastName',
  'avatar',
  'createdAt',
  'updatedAt',
);

export const UserPropulateSelects = getSelects<User>(
  'id',
  'firstName',
  'lastName',
  'avatar',
);
