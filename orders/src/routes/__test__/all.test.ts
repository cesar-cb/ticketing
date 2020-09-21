import request from 'supertest';
import { getRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import app from '../../app';

import Ticket from '../../models/Ticket';

const buildTicket = async () => {
  return getRepository(Ticket).save({
    id: uuidv4(),
    title: 'show',
    price: 800,
  });
};

describe('Routes/all', () => {
  it('fetches orders for an particular user', async () => {
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    await request(app)
      .post('/api/orders')
      .set('Cookie', userOne.session)
      .send({ ticketId: ticketOne.id })
      .expect(201);

    const { body: orderOne } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo.session)
      .send({ ticketId: ticketTwo.id })
      .expect(201);
    const { body: orderTwo } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo.session)
      .send({ ticketId: ticketThree.id })
      .expect(201);

    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', userTwo.session)
      .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
  });
});
