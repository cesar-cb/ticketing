import { Publisher, Subjects } from '@ticketingcb/common';
// TODO: fix export
import PaymentCreatedEvent from '@ticketingcb/common/build/events/interfaces/paymentCreatedEvent';

export default class PaymentCreatedPublisher extends Publisher<
  PaymentCreatedEvent
> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
