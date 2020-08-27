import { Publisher, Subjects, OrderCancelledEvent } from '@ticketingcb/common';

export default class OrderCancelledPublisher extends Publisher<
  OrderCancelledEvent
> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
