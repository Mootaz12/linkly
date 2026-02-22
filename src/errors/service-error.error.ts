import { IServicerError } from '@app-types/error.types';

export class ServicerError extends Error implements IServicerError {
  constructor(
    public override message: string,
    public code: string,
    public status: number,
  ) {
    super(message);
    this.message = message;
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, ServicerError.prototype);
  }
}
