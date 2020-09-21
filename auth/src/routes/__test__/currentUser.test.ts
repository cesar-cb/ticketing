import request from 'supertest';
import app from '../../app';

describe('Route/currentUser', () => {
  it('should return details about the current user', async () => {
    const cookie = await global.signup();

    const response = await request(app)
      .get('/api/users/current')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toBe('test@email.com');
  });

  it('should responds with null if not authenticated', async () => {
    const response = await request(app)
      .get('/api/users/current')
      .send()
      .expect(200);

    expect(response.body.currentUser).toBeNull();
  });
});
