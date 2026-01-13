const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/hello-world', () => {
  test('hello_world_route_should_return_status_success', async () => {
    // Given: tenemos la aplicación configurada
    
    // When: hacemos una petición GET a /api/hello-world
    const response = await request(app).get('/api/hello-world');

    // Then: debe retornar status 200 y el mensaje exacto
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: 'Hello, World!' });
  });

  test('should return JSON content-type', async () => {
    const response = await request(app).get('/api/hello-world');
    
    expect(response.headers['content-type']).toMatch(/json/);
  });
});