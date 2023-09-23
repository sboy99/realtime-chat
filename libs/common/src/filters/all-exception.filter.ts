import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ZodError } from 'zod';
import { IRequest } from '../interfaces';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('ExceptionHandler');
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<IRequest>();

    const path = req.originalUrl;
    const time = new Date(Date.now());
    let statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] | Record<string, string> =
      'Something went wrong';
    let error: unknown;
    /**
     * If exception is a HttpException
     */
    if (exception instanceof HttpException) {
      error = exception.getResponse();
      statusCode = exception.getStatus();
      message = exception.message;
      if (typeof error !== 'string') {
        statusCode = (error as any).statusCode;
        message = (error as any).message;
        error = (error as any).error;
      }
    }

    if (exception instanceof ZodError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Data validation exception';
      error = exception.errors.reduce<Record<string, string>>((acc, curr) => {
        acc[curr.path.join('.')] = curr.message;
        return acc;
      }, {});
    }

    /**
     * Build the Exception payload
     */
    const exceptionPayload = {
      statusCode,
      message,
      error,
      path,
      time,
    };

    this.logger.error((exception as any).message);
    httpAdapter.reply(ctx.getResponse(), exceptionPayload, statusCode);
  }
}
