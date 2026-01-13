const request = require('supertest');
const app = require('../../src/app');

describe('Web Routes - LAB01', () => {
  test('GET / should return 200 and welcome message', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('Hola desde la página de inicio');
  });

  test('GET /contacto should return contact page', async () => {
    const response = await request(app).get('/contacto');
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('contacto');
  });

  test('POST /contacto should process form', async () => {
    const response = await request(app).post('/contacto');
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('procesado');
  });

  test('GET /cursos/informacion should return static route (not dynamic)', async () => {
    const response = await request(app).get('/cursos/informacion');
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('información de los cursos');
  });

  test('GET /cursos/:curso should return course name', async () => {
    const response = await request(app).get('/cursos/nodejs');
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('nodejs');
  });

  test('GET /cursos/:curso/:categoria should return course and category', async () => {
    const response = await request(app).get('/cursos/nodejs/backend');
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('nodejs');
    expect(response.text).toContain('backend');
  });

  test('GET /cursos-alpha/:curso should validate alpha characters', async () => {
    const validResponse = await request(app).get('/cursos-alpha/laravel');
    expect(validResponse.status).toBe(200);

    const invalidResponse = await request(app).get('/cursos-alpha/laravel123');
    expect(invalidResponse.status).toBe(400);
  });

  test('GET /cursos-validos/:curso should validate allowed values', async () => {
    const validResponse = await request(app).get('/cursos-validos/nodejs');
    expect(validResponse.status).toBe(200);

    const invalidResponse = await request(app).get('/cursos-validos/python');
    expect(invalidResponse.status).toBe(400);
  });

  test('GET /cursos-id/:id should validate numeric ID', async () => {
    const validResponse = await request(app).get('/cursos-id/123');
    expect(validResponse.status).toBe(200);

    const invalidResponse = await request(app).get('/cursos-id/abc');
    expect(invalidResponse.status).toBe(400);
  });

  test('GET /posts should return posts index', async () => {
    const response = await request(app).get('/posts');
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('posts');
  });
});