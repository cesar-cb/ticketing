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
import Payment from '../models/Payment';
import stripe from '../stripe';
import PaymentCreatedPublisher from '../events/publishers/PaymentCreatedPublisher';
import natsWrapper from '../nats-wrapper';

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
    const paymentRepo = getRepository(Payment);

    const order = await orderRepo.findOne(orderId);

    if (!order) throw new NotFoundError('Order not found');

    if (order.userId !== req.currentUser?.id) throw new UnauthorizedError();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError('Cannot pay for an cancelled order');

    if (order.status === OrderStatus.Complete)
      throw new BadRequestError('Order already completed');

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
      description: 'Ticket payment',
    });

    const payment = await paymentRepo.save({ orderId, stripeId: charge.id });

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    return res.status(201).json({ id: payment.id });
  },
);

export default router;
