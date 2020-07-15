import express from 'express';
import { json } from 'body-parser';

import { signinRoute, signupRoute, signoutRoute, currentUserRouter } from './routes';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(json());

app.use(signinRoute);
app.use(signupRoute);
app.use(signoutRoute);
app.use(currentUserRouter);
app.use(errorHandler);

app.listen(3000, () => console.log('Listening on 3000 🚀'));
