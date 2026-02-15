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

export class ShortenUrlNotFoundException extends ServerError {
  constructor() {
    super(
      'Shortened URL not found',
      `${ErrorCodesPrefix.SHORTENER_ERROR}001`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ShortenUrlExpiredException extends ServerError {
  constructor() {
    super(
      'Shortened URL has expired',
      `${ErrorCodesPrefix.SHORTENER_ERROR}002`,
      HttpStatus.GONE,
    );
  }
}
