import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  UnauthorizedError,
  OrderStatus,
  BadRequestError,
} from '@ticketingcb/common';
import { body } from 'express-validator';
import { getRepository } from 'typeorm';

import Order from '../models/Order';
import stripe from '../stripe';

const router = express.Router();

const validatorRules = [
  body('token').not().isEmpty(),
  body('orderId').not().isEmpty(),
];

router.post(
  '/api/payments',
  requireAuth,
  validatorRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const orderRepo = getRepository(Order);

    const order = await orderRepo.findOne(orderId);

    if (!order) throw new NotFoundError('Order not found');

    if (order.userId !== req.currentUser?.id) throw new UnauthorizedError();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError('Cannot pay for an cancelled order');

    if (order.status === OrderStatus.Complete)
      throw new BadRequestError('Order already completed');

    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
      description: 'Ticket payment',
    });

    return res.status(201).json({});
  },
);

export default router;
