import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  ManyToOne,
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

  @Column()
  expiresAt: string;

  @VersionColumn()
  version: number;

  @ManyToOne(type => Ticket)
  ticket: Ticket;
}
