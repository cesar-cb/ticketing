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

    const newTicket = await ticketRepo.save({ ...ticket, orderId });

    await new TicketUpdatedPublisher(this.client).publish({
      id: newTicket.id,
      price: newTicket.price,
      title: newTicket.title,
      userId: newTicket.userId,
      orderId: newTicket.orderId,
      version: newTicket.version,
    });

    msg.ack();
  }
}
