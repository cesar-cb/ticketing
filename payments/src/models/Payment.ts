import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  stripeId: string;
}
