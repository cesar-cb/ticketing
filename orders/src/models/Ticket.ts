import { Entity, Column, PrimaryColumn, VersionColumn } from 'typeorm';

@Entity()
export default class Ticket {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('bigint')
  price: number;

  @Column({ nullable: true })
  orderId?: string;

  @VersionColumn()
  version: number;
}
