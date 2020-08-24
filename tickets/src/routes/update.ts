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
import TicketUpdatedPublisher from '../events/publishers/TicketUpdatedPublisher';
import natsWrapper from '../nats-wrapper';

const router = express.Router();

const validatorRules = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be grater than 0'),
];

router.put(
  '/api/tickets/:id',
  requireAuth,
  validatorRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const { id } = req.params;

    if (!uuidValidate(id))
      throw new BadRequestError('Id should be an valid UUID');

    const repo = getRepository(Ticket);

    const ticket = await repo.findOne(id);

    if (!ticket) throw new NotFoundError('Ticket not found');

    if (ticket.userId !== req.currentUser?.id) throw new UnauthorizedError();

    const updatedTicket = await repo.save({ ...ticket, title, price });

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: updatedTicket.id,
      title: updatedTicket.title,
      price: updatedTicket.price,
      userId: updatedTicket.userId,
      version: 1,
    });

    return res.status(201).json(updatedTicket);
  },
);

export default router;
