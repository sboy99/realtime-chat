import { UseGuards, applyDecorators } from '@nestjs/common';
import { AccessTokenGuard } from '../guards/access-token.guard';

export const CanAccess = () => applyDecorators(UseGuards(AccessTokenGuard));
