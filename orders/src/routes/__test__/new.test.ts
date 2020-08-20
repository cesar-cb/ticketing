import request from 'supertest';
import { getRepository } from 'typeorm';

import app from '../../app';
import Ticket from '../../models/Ticket';
import natsWrapper from '../../nats-wrapper';

describe('Routes/new', () => {
  it('should reach /api/tickets for post requests', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).not.toEqual(404);
  });

  it('should only be accessed if the user is signed in', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).toEqual(401);
  });

  it('should return status other than 401 if the user is signed in', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin().session)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('should return an error if an invalid title is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin().session)
      .send({
        title: '',
        price: 10,
      })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin().session)
      .send({
        price: 10,
      })
      .expect(400);
  });

  it('should return an error if an invalid price is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin().session)
      .send({
        title: 'valid title',
        price: '',
      })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin().session)
      .send({
        title: 'valid title',
      })
      .expect(400);
  });

  it('should create a ticket with valid inputs', async () => {
    const title = 'valid title';
    const price = 20.5;

    const createdTicket = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin().session)
      .send({
        title,
        price,
      })
      .expect(201);

    const { id } = createdTicket.body;

    const repo = getRepository(Ticket);

    const ticket = await repo.findOne(id);

    if (!ticket) return;

    expect(ticket.title).toEqual(createdTicket.body.title);
    expect(ticket.price).toEqual(createdTicket.body.price);
  });

  it('publishes an event', async () => {
    const title = 'asldkfj';

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin().session)
      .send({
        title,
        price: 20,
      })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
