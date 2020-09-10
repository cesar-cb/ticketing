import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  NotFoundError,
  OrderStatus,
} from '@ticketingcb/common';
import PaymentCreatedEvent from '@ticketingcb/common/build/events/interfaces/paymentCreatedEvent';
import { getRepository } from 'typeorm';

import { QUEUE_GROUP_NAME } from '../queueGroupName';
import Order from '../../models/Order';

export default class PaymentCreatedEventListener extends Listener<
  PaymentCreatedEvent
> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: PaymentCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const { orderId } = data;

    const orderRepo = getRepository(Order);

    const order = await orderRepo.findOne({
      where: { orderId },
      relations: ['ticket'],
    });

    if (!order) throw new NotFoundError('Order not found');

    await orderRepo.save({ ...order, status: OrderStatus.Complete });

    return msg.ack();
  }
}
