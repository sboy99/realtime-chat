import { serializeZodError } from '@app/common/utils';
import { Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Schema, z } from 'zod';

@Injectable()
export class SocketZodValidationPipe<T extends Schema>
  implements PipeTransform
{
  constructor(private schema: T) {}

  transform(value: z.infer<T>) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new WsException(serializeZodError<T>(error));
    }
  }
}
