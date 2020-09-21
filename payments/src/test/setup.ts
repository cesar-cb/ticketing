import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import connection from '../database';

interface ISigninPayload {
  session: string[];
  payload: {
    id: string;
    email: string;
  };
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    export interface Global {
      signin(userId?: string): ISigninPayload;
    }
  }
}

jest.mock('../nats-wrapper');

global.signin = (userId?: string) => {
  if (!process.env.JWT_KEY) throw new Error('Missing JWT_KEY value');
  // Build a JWT payload.  { id, email }
  const payload = {
    id: userId || uuidv4(),
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return { session: [`express:sess=${base64}`], payload };
};

process.env.STRIPE_KEY = 'pk_test_mock';

beforeAll(async () => {
  process.env.JWT_KEY = 'mockKey';

  await connection.create();
});

afterAll(async () => {
  await connection.close();
});

// afterEach(async () => {
//   await connection.clear();
// });
