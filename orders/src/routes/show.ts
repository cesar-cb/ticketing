import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import {
  requireAuth,
  NotFoundError,
  UnauthorizedError,
} from '@ticketingcb/common';

import Orders from '../models/Order';

const router = express.Router();

router.get(
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

    return res.json(order);
  },
);

export default router;
