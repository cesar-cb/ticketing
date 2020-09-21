import request from 'supertest';
import { getRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from '@ticketingcb/common';

import app from '../../app';
import Ticket from '../../models/Ticket';
import Order from '../../models/Order';
import natsWrapper from '../../nats-wrapper';

describe('Routes/new', () => {
  it('returns an error if the ticket does not exist', async () => {
    const ticketId = uuidv4();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin().session)
      .send({ ticketId })
      .expect(404);
  });

  it('returns an error if the ticket is already reserved', async () => {
    const ticket = await getRepository(Ticket).save({
      id: uuidv4(),
      title: 'concert',
      price: 20,
    });

    await getRepository(Order).save({
      userId: 'laskdflkajsdf',
      status: OrderStatus.Created,
      expiresAt: new Date().toISOString(),
      ticket,
    });

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin().session)
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it('reserves a ticket', async () => {
    const ticket = await getRepository(Ticket).save({
      id: uuidv4(),
      title: 'concert',
      price: 20,
    });

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin().session)
      .send({ ticketId: ticket.id })
      .expect(201);
  });

  it('emits an order created event', async () => {
    const ticket = await getRepository(Ticket).save({
      id: uuidv4(),
      title: 'concert',
      price: 20,
    });

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin().session)
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
