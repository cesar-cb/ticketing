import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from '@ticketingcb/common';
import { body } from 'express-validator';
import { getRepository, getCustomRepository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';

import OrderRepository from '../repositories/OrderRepository';
import Ticket from '../models/Ticket';
import natsWrapper from '../nats-wrapper';
import OrderCreatedPublisher from '../events/publishers/OrderCreatedPublisher';

const router = express.Router();

const validatorRules = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => uuidValidate(input))
    .withMessage('TicketId must be provided'),
];

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  validatorRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticketRepo = getRepository(Ticket);
    const orderRepo = getCustomRepository(OrderRepository);

    const createdTicket = await ticketRepo.save({
      title: 'title',
      price: 50,
    });

    // console.log(createdTicket);

    const ticket = await ticketRepo.findOne(ticketId);
    if (!ticket) throw new NotFoundError('Ticket not found');

    const isReserved = await orderRepo.isTicketReserved(ticketId);
    if (isReserved) throw new BadRequestError('Ticket is already reserved');

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Create Order
    const order = await orderRepo.save({
      userId: req.currentUser?.id,
      expiresAt: expiration,
      status: OrderStatus.Created,
      ticket,
    });

    // publish event
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: 1,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    return res.status(201).json(order);
  },
);

export default router;
