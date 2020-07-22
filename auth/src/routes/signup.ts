import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { body, validationResult } from 'express-validator';
import RequestValidationError from '../errors/RequestValidationError';
import User from '../models/User';

const router = express.Router();

const validator = [
  body('email').isEmail().withMessage('must be an email'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('password must be between 4 and 20 chars'),
];

router.post(
  '/api/users/signup',
  validator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

    const { email, password } = req.body;

    const repo = getRepository(User);

    const existingUser = await repo.find({ where: { email } });

    if (existingUser.length) {
      return res.send({ message: 'email in use' });
    }

    try {
      const user = await repo.save({ email, password });

      return res.status(201).send(user);
    } catch (error) {
      return res.status(500).send({ error });
    }
  },
);

export default router;
