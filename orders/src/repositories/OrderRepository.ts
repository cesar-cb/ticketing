import { OrderStatus } from '@ticketingcb/common';
import { EntityRepository, Repository } from 'typeorm';

import Order from '../models/Order';

@EntityRepository(Order)
export default class OrderRepository extends Repository<Order> {
  async isTicketReserved(ticketId: string): Promise<boolean> {
    const existingOrder = await this.createQueryBuilder('order')
      .leftJoinAndSelect('order.ticket', 'ticket')
      .where('ticket.id = :id', { id: ticketId })
      .andWhere('order.status != :status', { status: OrderStatus.Cancelled })
      .getOne();

    return !!existingOrder;
  }
}
