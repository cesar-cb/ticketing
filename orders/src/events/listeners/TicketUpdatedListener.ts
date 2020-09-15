import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
  NotFoundError,
} from '@ticketingcb/common';
import { getRepository } from 'typeorm';

import { QUEUE_GROUP_NAME } from '../queueGroupName';
import Ticket from '../../models/Ticket';

export default class TicketUpdatedEventListener extends Listener<
  TicketUpdatedEvent
> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: TicketUpdatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const { title, price, id, version, orderId } = data;

    const ticketRepo = getRepository(Ticket);

    const ticket = await ticketRepo.findOne({
      where: { id, version: version - 1 },
    });

    if (!ticket) throw new NotFoundError('Ticket not found');

    await ticketRepo.save({ ...ticket, price, title, orderId });

    msg.ack();
  }
}
