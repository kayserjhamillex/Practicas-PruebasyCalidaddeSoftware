const request = require('supertest');
const app = require('../../src/app');
const repositoryStore = require('../../src/stores/repositoryStore');

describe('Repositories CRUD (Feature)', () => {
  beforeEach(() => {
    repositoryStore.reset(); // equivalente a RefreshDatabase
  });

  test('store should create repository and redirect to /repositories', async () => {
    const data = { url: 'https://example.com', description: 'Repo de prueba' };

    const res = await request(app)
      .post('/repositories')
      .set('x-user-id', '1')          // simula usuario logueado
      .send(data);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/repositories');

    expect(repositoryStore.existsMatching({ userId: 1, ...data })).toBe(true);
  });

  test('update should update repository and redirect to /repositories', async () => {
    // Arrange
    repositoryStore.create({ userId: 1, url: 'https://old.com', description: 'Old' });

    const newData = { url: 'https://new.com', description: 'New' };

    // Act
    const res = await request(app)
      .put('/repositories/1')
      .set('x-user-id', '1')
      .send(newData);

    // Assert
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/repositories');

    expect(repositoryStore.existsMatching({ id: 1, userId: 1, ...newData })).toBe(true);
  });
});