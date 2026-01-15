const express = require('express');
const { validations } = require('../middleware/validations');
const HomeController = require('../controllers/HomeController');
const PostController = require('../controllers/PostController');
const authWeb = require("../middleware/authWeb")
const RepositoryController = require('../controllers/RepositoryController');
const StatusController = require("../controllers/StatusController");

const router = express.Router();

// ========================================
// RUTA PRINCIPAL (Dashboard)
// ========================================
// Equivalente Laravel: Route::get('/', [HomeController::class, '__invoke']);
router.get('/', HomeController.index);

// ========================================
// CONTACTO (sin controlador, lógica simple)
// ========================================
router
  .route('/contacto')
  .get((req, res) => res.send('Hola desde la página de contacto'))
  .post((req, res) => res.send('Formulario de contacto procesado'));

// ========================================
// CURSOS (rutas con validaciones)
// ========================================
// IMPORTANTE: ruta estática ANTES que la de parámetros (top-down)
router.get('/cursos/informacion', (req, res) => {
  res.send('Aquí podrás encontrar toda la información de los cursos');
});

// Cursos con parámetros (categoría "opcional" = 2 rutas explícitas)
router.get('/cursos/:curso', (req, res) => {
  const { curso } = req.params;
  res.send(`Bienvenido al curso: ${curso}`);
});

router.get('/cursos/:curso/:categoria', (req, res) => {
  const { curso, categoria } = req.params;
  res.send(`Bienvenido al curso: ${curso} de la categoría: ${categoria}`);
});

// Ejemplos de "where" tipo Laravel
router.get('/cursos-alpha/:curso', validations.alpha('curso'), (req, res) => {
  res.send(`Bienvenido al curso: ${req.params.curso}`);
});

router.get(
  '/cursos-validos/:curso',
  validations.whereIn('curso', ['php', 'laravel', 'vue', 'nodejs', 'express']),
  (req, res) => res.send(`Bienvenido al curso: ${req.params.curso}`)
);

router.get('/cursos-id/:id', validations.numeric('id'), (req, res) => {
  res.send(`Bienvenido al curso con ID: ${req.params.id}`);
});

// ========================================
// POSTS (CRUD con Controlador)
// ========================================
// Equivalente Laravel:
// Route::resource('articulos', PostController::class)
//   ->parameters(['articulos' => 'post'])
//   ->names('posts');

// Opción 1: Rutas individuales (más explícito)
router.get('/articulos', PostController.index);              // posts.index
router.get('/articulos/crear', PostController.create);       // posts.create
router.post('/articulos', PostController.store);             // posts.store
router.get('/articulos/:post', PostController.show);         // posts.show
router.get('/articulos/:post/editar', PostController.edit);  // posts.edit
router.put('/articulos/:post', PostController.update);       // posts.update
router.delete('/articulos/:post', PostController.destroy);   // posts.destroy

// Opción 2: Grupo de rutas (equivalente a Route::controller()->group())
// Descomenta si prefieres esta forma:
/*
router.route('/articulos')
  .get(PostController.index)
  .post(PostController.store);

router.get('/articulos/crear', PostController.create);

router.route('/articulos/:post')
  .get(PostController.show)
  .put(PostController.update)
  .delete(PostController.destroy);

router.get('/articulos/:post/editar', PostController.edit);
*/

// ========================================
// Ruta para el Login
// ========================================
router.get('/login', (req, res) => {
  res.status(200).send('Vista login');
});

// ========================================
// REPOSITORIOS (con autenticación y Controlador)
// ========================================
router.get('/repositories', authWeb.requireAuth, RepositoryController.index);
router.post('/repositories', authWeb.requireAuth, RepositoryController.store);
router.put('/repositories/:id', authWeb.requireAuth, RepositoryController.update);

router.post("/statuses", authWeb, StatusController.store);

module.exports = router;