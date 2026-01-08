const express = require('express');
const router = express.Router();

// Importar validaciones
const { validations } = require('../middleware/validations');

// Rutas básicas
router.get('/', (req, res) => {
    res.send('Hola desde la página de inicio');
});

router.route('/contacto')
    .get((req, res) => res.send('Hola desde la página de contacto'))
    .post((req, res) => res.send('Formulario de contacto procesado'));

// Rutas de cursos
router.get('/cursos/informacion', (req, res) => {
    res.send('Aquí podrás encontrar toda la información de los cursos');
});

router.get('/cursos/:curso/:categoria?', (req, res) => {
    const { curso, categoria } = req.params;
    if (categoria) {
        res.send(`Bienvenido al curso: ${curso} de la categoría: ${categoria}`);
    } else {
        res.send(`Bienvenido al curso: ${curso}`);
    }
});

module.exports = router;