import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { getRepository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';

import {
  requireAuth,
  validateRequest,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from '@ticketingcb/common';

import Ticket from '../models/Ticket';
import natsWrapper from '../nats-wrapper';

const router = express.Router();

const validatorRules = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be grater than 0'),
];

router.put(
  '/api/tickets/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    return res.status(201).json({});
  },
);

export default router;
