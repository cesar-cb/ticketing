import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'float' })
  price: number;

  @Column()
  userId: string;
}
