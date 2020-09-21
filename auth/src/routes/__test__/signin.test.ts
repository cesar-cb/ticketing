import request from 'supertest';
import app from '../../app';

describe('Route/signin', () => {
  it('should fail when email does not exists', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(404);
  });

  it('should fail when incorrect password is supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@email.com',
        password: 'wrongPassword',
      })
      .expect(404);
  });

  it('should define a cookie after successful signin', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test6@email.com',
        password: 'password',
      })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test6@email.com',
        password: 'password',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
