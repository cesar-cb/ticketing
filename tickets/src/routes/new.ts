import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@ticketingcb/common';
import { body } from 'express-validator';
import { getRepository } from 'typeorm';

import Ticket from '../models/Ticket';
import TicketCreatedPublisher from '../events/publishers/TicketCreatedPublisher';
import natsWrapper from '../nats-wrapper';

const router = express.Router();

const validatorRules = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be grater than 0'),
];

router.post(
  '/api/tickets',
  requireAuth,
  validatorRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const repo = getRepository(Ticket);

    const ticket = await repo.save({
      title,
      price,
      userId: req.currentUser?.id,
    });

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    return res.status(201).json(ticket);
  },
);

export default router;
