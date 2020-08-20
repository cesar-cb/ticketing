import jwt from 'jsonwebtoken';
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
      signin(): ISigninPayload;
    }
  }
}

jest.mock('../nats-wrapper');

global.signin = () => {
  if (!process.env.JWT_KEY) throw new Error('Missing JWT_KEY value');
  // Build a JWT payload.  { id, email }
  const payload = {
    id: '6c9794bc-b4f3-4734-a62b-982f84d96ca0',
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
