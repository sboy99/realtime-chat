import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '../guards';

export const UseAuth = () => applyDecorators(UseGuards(AuthGuard));
