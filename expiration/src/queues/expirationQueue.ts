import Queue from 'bull';
import ExpirationCompletePublisher from '../events/publishers/ExpirationCompletePublisher';
import natsWrapper from '../nats-wrapper';

if (!process.env.REDIS_HOST) throw new Error('Missing REDIS_HOST env');

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async job => {
  const { orderId } = job.data;

  return new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId,
  });
});

export default expirationQueue;
