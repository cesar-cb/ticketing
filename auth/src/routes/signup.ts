import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import RequestValidationError from '../errors/RequestValidationError';

const router = express.Router();

const validator = [
  body('email')
    .isEmail()
    .withMessage('must be an email'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('password must be between 4 and 20 chars'),
]

router.post('/api/users/signup', validator, (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

  const { email, password } = req.body;

  console.log({ email, password });

  return res.status(201).send({});
})

export { router as signupRoute };
