import { TicketUpdatedEvent, Publisher, Subjects } from '@ticketingcb/common';

export default class TicketUpdatedPublisher extends Publisher<
  TicketUpdatedEvent
> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
