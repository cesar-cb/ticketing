import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { requireAuth } from '@ticketingcb/common';

import Orders from '../models/Order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const repo = getRepository(Orders);

  const orders = await repo.find({
    where: { userId: req.currentUser?.id },
    relations: ['ticket'],
  });

  return res.json(orders);
});

export default router;
