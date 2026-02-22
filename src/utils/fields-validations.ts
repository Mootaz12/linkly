import { FiledValidationError } from '@errors/genral-errors';
import { ServicerError } from '@errors/service-error.error';

export function validateField(
  obj: Record<string, any>,
  field: string,
  error: ServicerError,
  {
    validateNull = false,
    validateUndefined = false,
    validateEmptyString = false,
    validateZero = false,
  }: {
    validateNull?: boolean;
    validateUndefined?: boolean;
    validateEmptyString?: boolean;
    validateZero?: boolean;
  } = {},
) {
  if (!(field in obj) || !obj[field]) {
    throw new FiledValidationError(error.message);
  }
  if (validateNull && obj[field] === null) {
    throw error;
  }
  if (validateUndefined && obj[field] === undefined) {
    throw error;
  }
  if (validateEmptyString && obj[field] === '') {
    throw error;
  }
  if (validateZero && obj[field] === 0) {
    throw error;
  }
}
