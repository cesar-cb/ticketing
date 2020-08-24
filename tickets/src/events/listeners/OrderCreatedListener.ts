import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  OrderCreatedEvent,
  NotFoundError,
} from '@ticketingcb/common';
import { getRepository } from 'typeorm';

import { QUEUE_GROUP_NAME } from '../queueGroupName';
import Ticket from '../../models/Ticket';
import TicketUpdatedPublisher from '../publishers/TicketUpdatedPublisher';

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const {
      ticket: { id: ticketId },
      id: orderId,
    } = data;

    const ticketRepo = getRepository(Ticket);

    const ticket = await ticketRepo.findOne(ticketId);

    if (!ticket) throw new NotFoundError('Ticket not found');

    await ticketRepo.save({ ...ticket, orderId });

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
