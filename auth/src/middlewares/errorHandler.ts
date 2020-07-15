import { Request, Response, NextFunction } from 'express';
import RequestValidationError from '../errors/RequestValidationError'

export default () => (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof RequestValidationError) {
    const formattedErrors = err.errors.map(error => {
      return { message: error.msg, field: error.param };
    });

    return res.status(400).send({ errors: formattedErrors });
  }

  res.status(400).send({ message: err.message })
}
