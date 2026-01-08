/**
 * PostController
 * Controlador para gestionar Posts (CRUD completo)
 * Equivalente a Laravel: php artisan make:controller PostController --resource
 */

class PostController {
  // GET /articulos - Listar todos los posts
  index(req, res) {
    res.send('Hola desde la página de posts');
  }

  // GET /articulos/crear - Mostrar formulario para crear un post
  create(req, res) {
    res.send('Aqui se mostrará el formulario para crear un post');
  }

  // POST /articulos - Guardar un nuevo post
  store(req, res) {
    res.send('Aqui se procesará el formulario para crear un post');
  }

  // GET /articulos/:post - Mostrar un post específico
  show(req, res) {
    const { post } = req.params;
    res.send(`Aqui se mostrará el post: ${post}`);
  }

  // GET /articulos/:post/editar - Mostrar formulario para editar un post
  edit(req, res) {
    const { post } = req.params;
    res.send(`Aqui se mostrará el formulario para editar un post: ${post}`);
  }

  // PUT /articulos/:post - Actualizar un post
  update(req, res) {
    const { post } = req.params;
    res.send(`Aqui se procesará el formulario para editar el post: ${post}`);
  }

  // DELETE /articulos/:post - Eliminar un post
  destroy(req, res) {
    const { post } = req.params;
    res.send(`Aqui se eliminará el post: ${post}`);
  }
}

module.exports = new PostController();