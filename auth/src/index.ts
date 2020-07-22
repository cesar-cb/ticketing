import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import 'express-async-errors';

import { signinRoute, signupRoute, signoutRoute, currentUserRouter } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/NotFoundError';

const app = express();
app.use(json());

app.use(signinRoute);
app.use(signupRoute);
app.use(signoutRoute);
app.use(currentUserRouter);

app.all('*', () => { throw new NotFoundError() });

app.use(errorHandler);

(async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    app.listen(3000, () => console.log('Listening on 3000 🚀'));
  } catch (error) {
    console.error(error);
  }
})();
