import { SocketEvents } from '@app/common/constants';
import { WsException } from '@nestjs/websockets';

// interface //
export interface IWsEventExceptionParams {
  event?: keyof typeof SocketEvents;
  error: string | object;
}

// class //
export class WsEventException extends WsException {
  private eventName: string;

  constructor({ event, error }: IWsEventExceptionParams) {
    super(error);
    this.eventName = !!event ? SocketEvents[event] : 'error';
  }

  public getEventName(): string {
    return this.eventName;
  }
}
