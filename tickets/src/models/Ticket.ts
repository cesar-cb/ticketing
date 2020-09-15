import { Entity, PrimaryGeneratedColumn, Column, VersionColumn } from 'typeorm';

@Entity()
export default class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('bigint')
  price: number;

  @Column()
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  orderId?: string | null;

  @VersionColumn()
  version: number;
}
