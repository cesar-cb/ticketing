import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import {
  requireAuth,
  NotFoundError,
  UnauthorizedError,
  OrderStatus,
} from '@ticketingcb/common';

import Orders from '../models/Order';

const router = express.Router();

router.patch(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const repo = getRepository(Orders);

    const order = await repo.findOne({
      where: { id: req.params.id },
    });

    if (!order) throw new NotFoundError('Order not found');

    if (order.userId !== req.currentUser?.id) throw new UnauthorizedError();

    const newOrder = await repo.save({
      ...order,
      status: OrderStatus.Cancelled,
    });

    return res.status(200).json(newOrder);
  },
);

export default router;
