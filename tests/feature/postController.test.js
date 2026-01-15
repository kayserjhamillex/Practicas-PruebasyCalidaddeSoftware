const request = require('supertest');
const app = require('../../src/app');

describe('PostController - CRUD Web', () => {
  test('GET /articulos should return posts index', async () => {
    const response = await request(app).get('/articulos');
    expect(response.status).toBe(200);
    expect(response.text).toContain('posts');
  });

  test('GET /articulos/crear should return create form', async () => {
    const response = await request(app).get('/articulos/crear');
    expect(response.status).toBe(200);
    expect(response.text).toContain('formulario para crear');
  });

  test('POST /articulos should process store', async () => {
    const response = await request(app).post('/articulos');
    expect(response.status).toBe(200);
    expect(response.text).toContain('procesará el formulario');
  });

  test('GET /articulos/:post should show specific post', async () => {
    const response = await request(app).get('/articulos/123');
    expect(response.status).toBe(200);
    expect(response.text).toContain('123');
  });

  test('GET /articulos/:post/editar should return edit form', async () => {
    const response = await request(app).get('/articulos/123/editar');
    expect(response.status).toBe(200);
    expect(response.text).toContain('editar');
    expect(response.text).toContain('123');
  });

  test('PUT /articulos/:post should update post', async () => {
    const response = await request(app).put('/articulos/123');
    expect(response.status).toBe(200);
    expect(response.text).toContain('editar');
  });

  test('DELETE /articulos/:post should destroy post', async () => {
    const response = await request(app).delete('/articulos/123');
    expect(response.status).toBe(200);
    expect(response.text).toContain('eliminará');
  });
});