import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  stripeId: string;
}
