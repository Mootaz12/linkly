import { HttpStatus } from '@nestjs/common';
import { ErrorCodesPrefix } from './error-codes.error';
import { ServicerError } from './service-error.error';

export class UserNotFoundException extends ServicerError {
  constructor() {
    super(
      'User not found',
      `${ErrorCodesPrefix.USER_ERROR}000`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UserEmailAlreadyExistsException extends ServicerError {
  constructor() {
    super(
      'User with this email already exists',
      `${ErrorCodesPrefix.USER_ERROR}001`,
      HttpStatus.CONFLICT,
    );
  }
}

export class MissingUserEmailException extends ServicerError {
  constructor() {
    super(
      'User email is required',
      `${ErrorCodesPrefix.USER_ERROR}002`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class MissingUserPasswordException extends ServicerError {
  constructor() {
    super(
      'User password is required',
      `${ErrorCodesPrefix.USER_ERROR}003`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
