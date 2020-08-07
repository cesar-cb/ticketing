import request from 'supertest';

import app from '../app';
import connection from '../database';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    export interface Global {
      signup(): Promise<string[]>;
    }
  }
}

global.signup = async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@email.com',
      password: 'password',
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};

beforeAll(async () => {
  process.env.JWT_KEY = 'mockKey';
  await connection.create();
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async () => {
  await connection.clear();
});
