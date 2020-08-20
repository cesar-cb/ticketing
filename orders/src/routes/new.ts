import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
} from '@ticketingcb/common';
import { body } from 'express-validator';
import { getRepository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';

import Order from '../models/Order';
import Ticket from '../models/Ticket';

const router = express.Router();

const validatorRules = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => uuidValidate(input))
    .withMessage('TicketId must be provided'),
];

router.post(
  '/api/orders',
  requireAuth,
  validatorRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticketRepo = getRepository(Ticket);
    const orderRepo = getRepository(Order);

    const createdTicket = await ticketRepo.save({ title: 'abc', price: 'abc' });

    const ticket = await ticketRepo.findOne(ticketId);
    if (!ticket) throw new NotFoundError('Ticket not found');

    const createdOrder = await orderRepo.save({
      userId: req.currentUser?.id,
      expiresAt: new Date(),
      ticket: createdTicket,
    });

    const order = await orderRepo.find({ relations: ['ticket'] });

    console.log(order[0].ticket);

    return res.status(201).json(ticket);
  },
);

export default router;
