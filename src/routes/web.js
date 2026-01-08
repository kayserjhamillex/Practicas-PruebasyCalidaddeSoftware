const express = require('express');
const { validations } = require('../middleware/validations');

const router = express.Router();

// Inicio
router.get('/', (req, res) => {
  res.send('Hola desde la página de inicio');
});

// Contacto: GET y POST (similar a Route::match)
router
  .route('/contacto')
  .get((req, res) => res.send('Hola desde la página de contacto'))
  .post((req, res) => res.send('Formulario de contacto procesado'));

// IMPORTANTE: ruta estática ANTES que la de parámetros (top-down)
router.get('/cursos/informacion', (req, res) => {
  res.send('Aquí podrás encontrar toda la información de los cursos');
});

// Cursos con parámetros (con categoría opcional)
router.get('/cursos/:curso{/:categoria}', (req, res) => {
  const { curso, categoria } = req.params;
  if (categoria) {
    return res.send(`Bienvenido al curso: ${curso} de la categoría: ${categoria}`);
  }
  return res.send(`Bienvenido al curso: ${curso}`);
});

// Ejemplos de “where” tipo Laravel
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

// CRUD “web” como en el PDF (respuestas simples)
router.get('/posts', (req, res) => res.send('Hola desde la página de posts'));
router.get('/posts/create', (req, res) => res.send('Hola desde la página para crear posts'));
router.post('/posts', (req, res) => res.send('Aqui se procesará el formulario para crear un post'));
router.get('/posts/:post', (req, res) => res.send(`Aqui se mostrará el post: ${req.params.post}`));
router.get('/posts/:post/edit', (req, res) =>
  res.send(`Aqui se mostrará el formulario para editar un post: ${req.params.post}`)
);
router.put('/posts/:post', (req, res) =>
  res.send(`Aqui se procesará el formulario para editar el post: ${req.params.post}`)
);
router.delete('/posts/:post', (req, res) => res.send(`Aqui se elminará el post: ${req.params.post}`));

module.exports = router;