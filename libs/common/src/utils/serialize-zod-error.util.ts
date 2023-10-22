import { HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

export const serializeZodError = <TSchema>({ errors }: ZodError<TSchema>) => {
  let error: string | Record<string, string>;
  // if no nested validation exception
  if (errors.length === 1 && !errors[0].path.length) {
    error = errors[0].message;
  }
  //   else if its a nested validation exception
  else {
    error = errors.reduce<Record<string, string>>((acc, curr) => {
      acc[curr.path.join('.')] = curr.message;
      return acc;
    }, {});
  }

  return {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Data validation exception',
    error,
  };
};
