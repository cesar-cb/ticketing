import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { NotFoundError, BadRequestError } from '@ticketingcb/common';
import { validate as uuidValidate } from 'uuid';

import Ticket from '../models/Ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!uuidValidate(id))
      throw new BadRequestError('Id should be an valid UUID');

    const repo = getRepository(Ticket);

    const ticket = await repo.findOne(id);

    if (!ticket) throw new NotFoundError('Ticket not found');

    return res.status(201).json(ticket);
  } catch (error) {
    throw new Error(error);
  }
});

export default router;
