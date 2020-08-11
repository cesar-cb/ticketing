import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateRequest, NotFoundError } from '@ticketingcb/common';

import User from '../models/User';

const router = express.Router();

const validator = [
  body('email').isEmail().withMessage('must be an email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password should not be empty'),
];

router.post(
  '/api/users/signin',
  validator,
  validateRequest,
  async (req: Request, res: Response) => {
    if (!process.env.JWT_KEY) throw new Error('Missing JWT_KEY value');

    const { email, password } = req.body;

    const repo = getRepository(User);

    const user = await repo.findOne({ where: { email } });

    if (!user) throw new NotFoundError('user not found');

    const compare = bcrypt.compareSync(password, user.password);

    if (!compare) throw new NotFoundError('user not found');

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY,
    );

    req.session = {
      jwt: userJwt,
    };

    return res.status(201).send(user);
  },
);

export default router;
