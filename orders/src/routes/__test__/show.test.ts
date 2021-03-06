import request from 'supertest';
import { getRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import app from '../../app';
import Ticket from '../../models/Ticket';

describe('Routes/show', () => {
  it('fetches the order', async () => {
    const ticket = await getRepository(Ticket).save({
      id: uuidv4(),
      title: 'concert',
      price: 20,
    });

    const user = global.signin();
    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user.session)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: fetchedOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', user.session)
      .send()
      .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
  });

  it('returns an error if one user tries to fetch another users order', async () => {
    const ticket = await getRepository(Ticket).save({
      id: uuidv4(),
      title: 'concert',
      price: 20,
    });

    const user = global.signin();
    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user.session)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', global.signin().session)
      .send()
      .expect(401);
  });
});
