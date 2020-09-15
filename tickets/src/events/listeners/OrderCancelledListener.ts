import { Listener, OrderCancelledEvent, Subjects } from '@ticketingcb/common';
import { Message } from 'node-nats-streaming';
import { getRepository } from 'typeorm';
import { omit } from 'lodash';

import { QUEUE_GROUP_NAME } from '../queueGroupName';
import TicketUpdatedPublisher from '../publishers/TicketUpdatedPublisher';
import Ticket from '../../models/Ticket';

export default class OrderCancelledListener extends Listener<
  OrderCancelledEvent
> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message,
  ): Promise<void> {
    const ticketRepo = getRepository(Ticket);
    const ticket = await ticketRepo.findOne(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const newTicket = await ticketRepo.save({
      ...ticket,
      orderId: null,
    });

    console.log({ newTicket });

    await new TicketUpdatedPublisher(this.client).publish({
      id: newTicket.id,
      orderId: null,
      userId: newTicket.userId,
      price: newTicket.price,
      title: newTicket.title,
      version: newTicket.version,
    });

    msg.ack();
  }
}
