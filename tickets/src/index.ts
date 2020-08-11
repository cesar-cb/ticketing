import app from './app';
import dbConnection from './database';

const start = async () => {
  await dbConnection.create();
};

start();

app.listen(3000, () => console.log('Listening on 3000 🚀'));
