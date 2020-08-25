import { OrderCreatedEvent, Subjects, Listener } from '@ticketingcb/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../queueGroupName';
import expirationQueue from '../../queues/expirationQueue';

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log(`Waiting ${delay} milliseconds to process the job`);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      },
    );

    msg.ack();
  }
}
