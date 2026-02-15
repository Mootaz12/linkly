import { HttpStatus } from '@nestjs/common';
import { ErrorCodesPrefix } from './error-codes.error';
import { ServerError } from './server-error.error';

export class MaxCreatingShortenUrlAttemptsExceeded extends ServerError {
  constructor() {
    super(
      'Max attempts exceeded while trying to generate shorten-url',
      `${ErrorCodesPrefix.SHORTENER_ERROR}000`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
