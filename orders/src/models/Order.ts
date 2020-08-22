import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderStatus } from '@ticketingcb/common';

import Ticket from './Ticket';

@Entity()
export default class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Created,
  })
  status: OrderStatus;

  @Column('date')
  expiresAt: Date;

  @OneToOne(() => Ticket)
  @JoinColumn()
  ticket: Ticket;
}
