import express from 'express';
import { json } from 'body-parser';
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

app.use(signinRoute);
app.use(signupRoute);
app.use(signoutRoute);
app.use(currentUserRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => console.log('Listening on 3000 🚀'));
