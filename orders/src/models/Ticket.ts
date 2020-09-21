import { Entity, Column, PrimaryColumn, VersionColumn } from 'typeorm';

@Entity()
export default class Ticket {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('bigint')
  price: number;

  @Column({ type: 'varchar', nullable: true })
  orderId?: string | null;

  @VersionColumn()
  version: number;
}
