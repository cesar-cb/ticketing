import express, { Request, Response } from 'express';
import { currentUser } from '@ticketingcb/common';

const router = express.Router();

router.get('/api/users/current', currentUser, (req: Request, res: Response) => {
  res.json({ currentUser: req.currentUser });
});

export default router;
