import { ValidationError } from 'express-validator';

export default class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }
}
