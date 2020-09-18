import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Ticket from '../models/Ticket';

const router = express.Router();

router.get('/api/tickets/', async (req: Request, res: Response) => {
  try {
    const repo = getRepository(Ticket);

    const tickets = await repo.find({
      where: { orderId: null },
    });

    return res.status(201).json(tickets);
  } catch (error) {
    throw new Error(error);
  }
});

export default router;
