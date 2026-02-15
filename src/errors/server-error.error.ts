import { IServerError } from '@app-types/error.types';

export class ServerError extends Error implements IServerError {
  constructor(
    public override message: string,
    public code: string,
    public status: number,
  ) {
    super(message);
    this.message = message;
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
