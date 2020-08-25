import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@ticketingcb/common';

export default class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
