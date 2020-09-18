import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  AfterLoad,
} from 'typeorm';

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

  @AfterLoad() convertNumerics() {
    this.price = parseFloat(this.price as any);
  }
}
