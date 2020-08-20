import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private clientInstance?: Stan;

  get client() {
    if (!this.clientInstance) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this.clientInstance;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this.clientInstance = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', err => {
        reject(err);
      });
    });
  }
}

export default new NatsWrapper();
