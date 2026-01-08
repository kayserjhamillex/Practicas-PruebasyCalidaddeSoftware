let repositories = [];
let nextId = 1;

function reset() {
  repositories = [];
  nextId = 1;
}

function all() {
  return [...repositories];
}

function create({ userId, url, description }) {
  const repo = {
    id: nextId++,
    userId,
    url,
    description
  };
  repositories.push(repo);
  return repo;
}

function findById(id) {
  return repositories.find((r) => r.id === Number(id)) || null;
}

function update(id, patch) {
  const repo = findById(id);
  if (!repo) return null;

  if (patch.url !== undefined) repo.url = patch.url;
  if (patch.description !== undefined) repo.description = patch.description;

  return repo;
}

function existsMatching(partial) {
  return repositories.some((r) => {
    return Object.entries(partial).every(([k, v]) => r[k] === v);
  });
}

module.exports = {
  reset,
  all,
  create,
  findById,
  update,
  existsMatching
};