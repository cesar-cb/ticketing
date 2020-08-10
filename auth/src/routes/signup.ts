import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import User from '../models/User';
import BadRequestError from '../errors/BadRequestError';
import { validateRequest } from '../middlewares/validateRequest';

const router = express.Router();

const validator = [
  body('email').isEmail().withMessage('Must be an email'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 chars'),
];

router.post(
  '/api/users/signup',
  validator,
  validateRequest,
  async (req: Request, res: Response) => {
    if (!process.env.JWT_KEY) throw new Error('Missing JWT_KEY value');

    const { email, password } = req.body;

    const repo = getRepository(User);

    const existingUser = await repo.find({ where: { email } });

    if (existingUser.length) {
      throw new BadRequestError('Email in use');
    }

    try {
      const user = new User();

      user.email = email;
      user.password = password;

      const response = await repo.save(user);

      const userJwt = jwt.sign(
        {
          id: response.id,
          email: response.email,
        },
        process.env.JWT_KEY,
      );

      req.session = {
        jwt: userJwt,
      };

      return res.status(201).send(response);
    } catch (error) {
      return res.status(500).send({ error });
    }
  },
);

export default router;
