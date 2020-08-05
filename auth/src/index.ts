import express from 'express';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import 'reflect-metadata';
import './database';

import 'express-async-errors';

import {
  signinRoute,
  signupRoute,
  signoutRoute,
  currentUserRouter,
} from './routes';
import { errorHandler } from './middlewares/errorHandler';
import NotFoundError from './errors/NotFoundError';

const app = express();
app.use(json());
app.set('trust proxy', true);
app.use(
  cookieSession({
    secure: true,
    signed: false,
  }),
);

app.use(signinRoute);
app.use(signupRoute);
app.use(signoutRoute);
app.use(currentUserRouter);

app.all('*', () => {
  throw new NotFoundError('route not found');
});

app.use(errorHandler);

app.listen(3000, () => console.log('Listening on 3000 🚀'));
