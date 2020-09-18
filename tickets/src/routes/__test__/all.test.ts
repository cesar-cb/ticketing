import request from 'supertest';
import { getRepository } from 'typeorm';

import app from '../../app';

import Ticket from '../../models/Ticket';

describe('Routes/index', () => {
  it('should fetch a list of tickets', async () => {
    const title = 'valid title';
    const price = 200;

    const repo = getRepository(Ticket);

    await repo.save({ title, price, userId: 'uuid' });

    const response = await request(app).get('/api/tickets').send();

    expect(response.body).toHaveLength(1);
  });
});
