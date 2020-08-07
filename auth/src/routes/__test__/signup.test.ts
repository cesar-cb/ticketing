import request from 'supertest';
import app from '../../app';

describe('Route/signup', () => {
  it('should return 201 on successful signup', () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(201);
  });

  it('should return 400 if invalid email', () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'invalid email',
        password: 'password',
      })
      .expect(400);
  });

  it('should return 400 if invalid password', () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@email.com',
        password: '1',
      })
      .expect(400);
  });

  it('should return 400 if missing password and email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'email@email.com',
      })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({
        password: 'mySecretPassword',
      })
      .expect(400);
  });

  it('should disallows duplicate email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'email@email.com',
        password: 'mySecretPassword',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'email@email.com',
        password: 'mySecretPassword',
      })
      .expect(400);
  });

  it('should set a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'email@email.com',
        password: 'mySecretPassword',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
