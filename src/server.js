const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Rutas web disponibles en http://localhost:${PORT}/`);
  console.log(`🔌 API disponible en http://localhost:${PORT}/api`);
});