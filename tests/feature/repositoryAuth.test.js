const request = require('supertest');
const app = require('../../src/app');

describe('Protección de rutas - repositories', () => {
  test('guest should be redirected to /login', async () => {
    const res1 = await request(app).get('/repositories');
    expect(res1.status).toBe(302);
    expect(res1.headers.location).toBe('/login');

    const res2 = await request(app).post('/repositories').send({ url: 'x', description: 'y' });
    expect(res2.status).toBe(302);
    expect(res2.headers.location).toBe('/login');

    const res3 = await request(app).put('/repositories/1').send({ url: 'x2' });
    expect(res3.status).toBe(302);
    expect(res3.headers.location).toBe('/login');
  });
});