const repositoryStore = require('../stores/repositoryStore');

class RepositoryController {
  index(req, res) {
    const repos = repositoryStore.all();
    // Para laboratorio devolvemos texto simple, como en los PDFs.
    res.status(200).send(`Repositorios: ${repos.length}`);
  }

  store(req, res) {
    // Similar a: $request->user()->repositories()->create($request->all());
    const { url, description } = req.body;

    if (!url || !description) {
      return res.status(400).send('url y description son requeridos');
    }

    repositoryStore.create({
      userId: req.user.id,
      url,
      description
    });

    // Similar a: return redirect()->route('repositories.index');
    return res.redirect(302, '/repositories');
  }

  update(req, res) {
    const { id } = req.params;
    const { url, description } = req.body;

    const updated = repositoryStore.update(id, { url, description });
    if (!updated) return res.status(404).send('Repositorio no encontrado');

    return res.redirect(302, '/repositories');
  }
}

module.exports = new RepositoryController();