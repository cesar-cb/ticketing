import { Message } from 'node-nats-streaming';
import { Listener, TicketCreatedEvent, Subjects } from '@ticketingcb/common';
import { getRepository } from 'typeorm';

import { QUEUE_GROUP_NAME } from '../queueGroupName';
import Ticket from '../../models/Ticket';

export default class TicketCreatedEventListener extends Listener<
  TicketCreatedEvent
> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: TicketCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const { title, price, id } = data;

    await getRepository(Ticket).save({ id, title, price });

    msg.ack();
  }
}
