import { ServicerError } from './service-error.error';
import { ErrorCodesPrefix } from './error-codes.error';
import { HttpStatus } from '@nestjs/common';

export class FiledValidationError extends ServicerError {
  constructor(message?: string) {
    super(
      message || 'Filed validation error',
      `${ErrorCodesPrefix.GENERAL_ERROR}000`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
