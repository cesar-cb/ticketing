import request from 'supertest';
import { getRepository } from 'typeorm';

import app from '../../app';
import Ticket from '../../models/Ticket';

describe('Routes/show', () => {
  it('should return 404 if the ticket is not found', async () => {
    const response = await request(app)
      .get('/api/tickets/not-found-ticket')
      .send({});

    expect(response.status).not.toEqual(404);
  });

  it('should return the ticket if ticket is found', async () => {
    const title = 'title';
    const price = 20;
    const userId = 'uuid';

    const repo = getRepository(Ticket);
    const ticket = await repo.save({ title, price, userId });

    const response = await request(app)
      .get(`/api/tickets/${ticket.id}`)
      .send({ title, price })
      .expect(201);

    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(price);
    expect(response.body.userId).toEqual(userId);
  });

  it('should throw error if provid id is not an uuid', async () => {
    const title = 'title';
    const price = 20;

    await request(app)
      .get(`/api/tickets/not-uuid`)
      .send({ title, price })
      .expect(400);
  });
});
