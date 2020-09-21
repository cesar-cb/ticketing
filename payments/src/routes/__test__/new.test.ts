import request from 'supertest';
import { getRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from '@ticketingcb/common';

import app from '../../app';

import Order from '../../models/Order';
import Payment from '../../models/Payment';

const fakeStripeId = 'fake stripe id';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      charges: {
        create: () => ({ id: fakeStripeId }),
      },
    };
  });
});

describe('Routes/new', () => {
  it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin().session)
      .send({
        token: 'asldkfj',
        orderId: uuidv4(),
      })
      .expect(404);
  });

  it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
    const order = await getRepository(Order).save({
      id: uuidv4(),
      userId: uuidv4(),
      version: 0,
      price: 20,
      status: OrderStatus.Created,
    });

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin().session)
      .send({
        token: 'asldkfj',
        orderId: order.id,
      })
      .expect(401);
  });

  it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = uuidv4();
    const order = await getRepository(Order).save({
      id: uuidv4(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.Cancelled,
    });

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId).session)
      .send({
        orderId: order.id,
        token: 'asdlkfj',
      })
      .expect(400);
  });

  it('returns a 201 with valid inputs', async () => {
    const userId = uuidv4();
    const price = 200;
    const order = await getRepository(Order).save({
      id: uuidv4(),
      userId,
      version: 0,
      price,
      status: OrderStatus.Created,
    });

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId).session)
      .send({
        token: 'tok_visa',
        orderId: order.id,
      })
      .expect(201);

    const payment = await getRepository(Payment).findOne({
      where: {
        orderId: order.id,
        stripeId: fakeStripeId,
      },
    });

    expect(payment).not.toBeNull();
  });
});
