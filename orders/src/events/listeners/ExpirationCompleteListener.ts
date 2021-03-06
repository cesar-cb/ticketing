import { Message } from 'node-nats-streaming';
import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  NotFoundError,
  OrderStatus,
} from '@ticketingcb/common';
import { getRepository } from 'typeorm';

import { QUEUE_GROUP_NAME } from '../queueGroupName';
import Order from '../../models/Order';
import OrderCancelledPublisher from '../publishers/OrderCancelledPublisher';

export default class ExpirationCompleteEventListener extends Listener<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: ExpirationCompleteEvent['data'],
    msg: Message,
  ): Promise<void> {
    const { orderId } = data;

    const orderRepo = getRepository(Order);

    const order = await orderRepo.findOne({
      where: { id: orderId },
      relations: ['ticket'],
    });

    if (!order) throw new NotFoundError('Order not found');

    if (order.status === OrderStatus.Complete) return msg.ack();

    const newOrder = await orderRepo.save({
      ...order,
      status: OrderStatus.Cancelled,
    });

    new OrderCancelledPublisher(this.client).publish({
      id: newOrder.id,
      version: newOrder.version,
      ticket: {
        id: newOrder.ticket.id,
      },
    });

    return msg.ack();
  }
}
