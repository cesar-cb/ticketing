/* eslint-disable import/prefer-default-export */
import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../errors/UnauthorizedError';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): UnauthorizedError | void => {
  if (!req.currentUser) throw new UnauthorizedError();

  return next();
};
