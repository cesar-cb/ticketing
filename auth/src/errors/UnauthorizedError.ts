import CustomError from './CustomError';

export default class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  // TODO: create typedef
  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
