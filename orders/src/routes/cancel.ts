import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import {
  requireAuth,
  NotFoundError,
  UnauthorizedError,
  OrderStatus,
} from '@ticketingcb/common';

import Orders from '../models/Order';
import OrderCancelledPublisher from '../events/publishers/OrderCancelledPublisher';
import natsWrapper from '../nats-wrapper';

const router = express.Router();

router.patch(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const repo = getRepository(Orders);

    const order = await repo.findOne({
      where: { id: req.params.id },
      relations: ['ticket'],
    });

    if (!order) throw new NotFoundError('Order not found');

    if (order.userId !== req.currentUser?.id) throw new UnauthorizedError();

    const newOrder = await repo.save({
      ...order,
      status: OrderStatus.Cancelled,
    });

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    return res.status(200).json(newOrder);
  },
);

export default router;
