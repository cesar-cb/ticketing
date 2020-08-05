/* eslint-disable import/prefer-default-export */
import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/CustomError';

// TODO: Remove next warning

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .send({ errors: err.serializeErrors(), status: err.statusCode });
  }

  const { message } = err;

  return res.status(400).send({
    errors: [{ message }],
  });
};
