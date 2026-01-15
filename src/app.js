const express = require('express');

const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
const postRoutesStore = require('./routes/posts');

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple (similar a “ver requests” en Laravel)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rutas “web” (equivalente a routes/web.php)
app.use('/', webRoutes);

// Rutas API (equivalente a routes/api.php)
app.use('/api', apiRoutes);

// Ruta para la practica 8
app.use('/p8', postRoutesStore);

// 404 (respuesta simple; si quieres puedes diferenciar web vs api)
app.use((req, res) => {
  // Si es /api -> responde JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  return res.status(404).send('404 NOT FOUND - La ruta no existe');
});

module.exports = app;