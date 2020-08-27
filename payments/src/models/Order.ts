import { Entity, PrimaryGeneratedColumn, Column, VersionColumn } from 'typeorm';
import { OrderStatus } from '@ticketingcb/common';

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

  @Column('bigint')
  price: number;

  @VersionColumn()
  version: number;
}
