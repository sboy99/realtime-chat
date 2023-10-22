// ws.filter.ts
import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { IAuthSocket } from '../interfaces';

@Catch(WsException)
export class WsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<IAuthSocket>();
    const error = exception.getError();

    // If needed, you can also send a response back to the client
    client.emit('error', error);
  }
}
