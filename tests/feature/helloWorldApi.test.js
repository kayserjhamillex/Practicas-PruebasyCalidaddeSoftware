const request = require('supertest');
const app = require('../../src/app');

describe('API - Hello World (TDD)', () => {
  test('hello_world_route_should_return_status_success', async () => {
    // Teniendo (Given)
    // (No necesitamos estado inicial)
    // Haciendo (When)
    const response = await request(app).get('/api/hello-world');
    // Esperando (Then)
    expect(response.status).toBe(200);
  });

  test('hello_world_route_should_return_exact_json_message', async () => {
    const response = await request(app).get('/api/hello-world');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: 'Hello, World!' }); // exactitud como indica el PDF
  });
});