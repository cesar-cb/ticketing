/* eslint-disable import/prefer-default-export */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IUserPayload {
  id: string;
  email: string;
}

// TODO: Remove old namespace declaration

// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace Express {
//     interface Request {
//       currentUser?: IUserPayload | null;
//     }
//   }
// }

declare module 'express' {
  export interface Request {
    currentUser?: IUserPayload | null;
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.session?.jwt) {
    req.currentUser = null;
    return next();
  }

  if (!process.env.JWT_KEY) throw new Error('Missing JWT_KEY value');

  try {
    const payload = jwt.verify(
      req.session?.jwt,
      process.env.JWT_KEY,
    ) as IUserPayload;

    req.currentUser = payload;
  } catch (error) {
    throw new Error(error);
  }

  return next();
};
