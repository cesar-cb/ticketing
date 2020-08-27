import { Message } from 'node-nats-streaming';
import { Listener, Subjects, OrderCreatedEvent } from '@ticketingcb/common';
import { getRepository } from 'typeorm';

import { QUEUE_GROUP_NAME } from '../queueGroupName';
import Order from '../../models/Order';

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const {
      id,
      ticket: { price },
      status,
      userId,
      version,
    } = data;

    await getRepository(Order).save({
      id,
      price,
      status,
      userId,
      version,
    });

    return msg.ack();
  }
}
