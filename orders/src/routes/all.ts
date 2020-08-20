import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Orders from '../models/Order';

const router = express.Router();

router.get('/api/orders', async (req: Request, res: Response) => {
  try {
    const repo = getRepository(Orders);

    const orders = await repo.find();

    return res.status(201).json(orders);
  } catch (error) {
    throw new Error(error);
  }
});

export default router;
