import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

import { getRepository } from 'typeorm';

import app from '../../app';
import Ticket from '../../models/Ticket';
import natsWrapper from '../../nats-wrapper';

describe('Routes/update', () => {
  it('should return 404 if provided id does not exist', async () => {
    const id = uuidv4();

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin().session)
      .send({
        title: 'valid title',
        price: 20,
      })
      .expect(404);
  });

  it('publishes an event', async () => {
    const cookie = global.signin().session;

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'asldkfj',
        price: 20,
      });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'new title',
        price: 100,
      })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
  });

  it('should return 401 if user is not authenticated', async () => {
    const id = uuidv4();

    await request(app)
      .put(`/api/tickets/${id}`)
      .send({
        title: 'new valid title',
        price: 20,
      })
      .expect(401);
  });

  it('should return 401 if the user does not own the ticket', async () => {
    const title = 'valid title';
    const price = 200;
    const id = uuidv4();

    const repo = getRepository(Ticket);
    const createdTicket = await repo.save({ title, price, userId: id });

    await request(app)
      .put(`/api/tickets/${createdTicket.id}`)
      .set('Cookie', global.signin().session)
      .send({
        title: 'new valid title',
        price: 50,
      })
      .expect(401);
  });

  it('should return 400 if user provides invalid title or price', async () => {
    const id = uuidv4();

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin().session)
      .send({
        title: '',
        price: 50,
      })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin().session)
      .send({
        title: 'new valid title',
        price: '',
      })
      .expect(400);
  });

  it('should update the ticket provided valid inputs', async () => {
    const title = 'valid title';
    const price = 200;
    const userId = global.signin().payload.id;

    const repo = getRepository(Ticket);
    const createdTicket = await repo.save({ title, price, userId });

    const updatedTicket = await request(app)
      .put(`/api/tickets/${createdTicket.id}`)
      .set('Cookie', global.signin().session)
      .send({
        title: 'new valid title',
        price: 50,
      })
      .expect(201);

    console.log(typeof updatedTicket.body.price);

    expect(updatedTicket.body.title).toBe('new valid title');
    expect(updatedTicket.body.price).toBe(50);

    const ticket = await repo.findOne(updatedTicket.body.id);

    if (!ticket) return;

    expect(ticket.title).toBe('new valid title');
    expect(ticket.price).toBe(50);
  });

  it('should be an valid uuid', async () => {
    await request(app)
      .put('/api/tickets/not-valid-uuid')
      .set('Cookie', global.signin().session)
      .send({
        title: 'new valid title',
        price: 50,
      })
      .expect(400);
  });
});
