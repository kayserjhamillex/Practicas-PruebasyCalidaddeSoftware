/**
 * HomeController
 * Controlador para la página principal (Dashboard)
 * Equivalente a Laravel: php artisan make:controller HomeController --invokable
 */

class HomeController {
  // Método __invoke (controlador de acción única)
  index(req, res) {
    res.send('Hola desde la página principal');
  }
}

module.exports = new HomeController();