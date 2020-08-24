import { Publisher, Subjects, OrderCreatedEvent } from '@ticketingcb/common';

export default class OrderCreatedPublisher extends Publisher<
  OrderCreatedEvent
> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
