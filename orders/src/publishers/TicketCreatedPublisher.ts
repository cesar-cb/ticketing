import { TicketCreatedEvent, Publisher, Subjects } from '@ticketingcb/common';

export default class TicketCreatedPublisher extends Publisher<
  TicketCreatedEvent
> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
