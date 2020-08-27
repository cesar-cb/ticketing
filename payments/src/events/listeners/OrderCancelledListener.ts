import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  OrderCreatedEvent,
  OrderCancelledEvent,
  NotFoundError,
  OrderStatus,
} from '@ticketingcb/common';
import { getRepository } from 'typeorm';

import { QUEUE_GROUP_NAME } from '../queueGroupName';
import Order from '../../models/Order';

export default class OrderCancelledListener extends Listener<
  OrderCancelledEvent
> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const { id } = data;

    const orderRepo = getRepository(Order);

    const order = await orderRepo.findOne(id);

    if (!order) throw new NotFoundError('Order not found');

    await getRepository(Order).save({
      ...order,
      status: OrderStatus.Cancelled,
    });

    msg.ack();
  }
}
