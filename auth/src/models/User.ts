import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import bcrypt from 'bcrypt';

@Entity()
export default class User {
  toJSON(): this {
    delete this.password;
    return this;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(): void {
    const { password } = this;
    const hash = bcrypt.hashSync(password, 10);

    this.password = hash;
  }
}
