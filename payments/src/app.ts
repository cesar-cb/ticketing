import express from 'express';
import { json } from 'body-parser';
import morgan from 'morgan';

import cookieSession from 'cookie-session';

import 'reflect-metadata';
import 'express-async-errors';

import { errorHandler, NotFoundError, currentUser } from '@ticketingcb/common';

import { newPaymentRoute } from './routes';

const app = express();

app.use(json());
app.use(morgan('tiny'));
app.set('trust proxy', true);
app.use(
  cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false,
  }),
);

app.use(currentUser);

app.use(newPaymentRoute);

app.all('*', () => {
  throw new NotFoundError('route not found');
});

app.use(errorHandler);

export default app;
