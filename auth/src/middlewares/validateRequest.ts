/* eslint-disable import/prefer-default-export */
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import RequestValidationError from '../errors/RequestValidationError';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): RequestValidationError | void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

  return next();
};
