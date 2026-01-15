const repositoryStore = require('../../../src/stores/repositoryStore')

describe('Relaciones (Unit) - User <> Repository', () => {
  beforeEach(() => {
    repositoryStore.reset();
  });

  test('a user can have many repositories (hasMany)', () => {
    repositoryStore.create({ userId: 10, url: 'https://a.com', description: 'A' });
    repositoryStore.create({ userId: 10, url: 'https://b.com', description: 'B' });
    repositoryStore.create({ userId: 99, url: 'https://c.com', description: 'C' });

    const all = repositoryStore.all();
    const userRepos = all.filter((r) => r.userId === 10);

    expect(userRepos).toHaveLength(2);
  });

  test('a repository belongs to a user (belongsTo via userId)', () => {
    const repo = repositoryStore.create({ userId: 7, url: 'https://x.com', description: 'X' });
    expect(repo.userId).toBe(7);
  });
});