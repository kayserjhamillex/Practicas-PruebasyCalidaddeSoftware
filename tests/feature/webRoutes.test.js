const request = require('supertest');
const app = require('../../src/app');

describe('WEB routes (Lab 01)', () => {
  test('root_should_return_hola_inicio', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hola desde la página principal');
  });

  test('contacto_get_should_return_text', async () => {
    const res = await request(app).get('/contacto');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hola desde la página de contacto');
  });
});