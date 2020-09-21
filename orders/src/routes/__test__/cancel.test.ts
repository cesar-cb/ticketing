import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from '@ticketingcb/common';
import { getRepository } from 'typeorm';

import app from '../../app';
import Ticket from '../../models/Ticket';
import Order from '../../models/Order';
import natsWrapper from '../../nats-wrapper';

describe('Routes/cancel', () => {
  it('marks an order as cancelled', async () => {
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
      .patch(`/api/orders/${order.id}`)
      .set('Cookie', user.session)
      .send()
      .expect(204);

    const updatedOrder = await getRepository(Order).findOne(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
  });

  it('emits a order cancelled event', async () => {
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
      .patch(`/api/orders/${order.id}`)
      .set('Cookie', user.session)
      .send()
      .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
