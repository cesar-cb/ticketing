import app from './app';
import dbConnection from './database';
import natsWrapper from './nats-wrapper';
import OrderCancelledListener from './events/listeners/OrderCancelledListener';
import OrderCreatedListener from './events/listeners/OrderCreatedListener';

const start = async () => {
  try {
    const natsUrl = process.env.NATS_URL;
    const natsClientId = process.env.NATS_CLIENT_ID;
    const natsClusterId = process.env.NATS_CLUSTER_ID;

    if (!natsUrl || !natsClientId || !natsClusterId)
      throw new Error('Missing NATS variables');

    await dbConnection.create();
    await natsWrapper.connect(natsClusterId, natsClientId, natsUrl);

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
  } catch (error) {
    console.error(error);
  }
};

start();

app.listen(3000, () => console.log('Listening on 3000 🚀'));
