const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware personalizado para logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// ============================================
// RUTAS BÁSICAS
// ============================================

// Ruta principal
app.get('/', (req, res) => {
    res.send('Hola desde la página de inicio');
});

// Ruta de contacto (acepta GET y POST)
app.route('/contacto')
    .get((req, res) => {
        res.send('Hola desde la página de contacto');
    })
    .post((req, res) => {
        res.send('Formulario de contacto procesado');
    });

// ============================================
// RUTAS CON PARÁMETROS
// ============================================

// Ruta estática (debe ir ANTES de las rutas con parámetros)
app.get('/cursos/informacion', (req, res) => {
    res.send('Aquí podrás encontrar toda la información de los cursos');
});

// Ruta con un parámetro
app.get('/cursos/:curso', (req, res) => {
    const { curso } = req.params;
    res.send(`Bienvenido al curso: ${curso}`);
});

// Ruta con dos parámetros (con parámetro opcional)
app.get('/cursos/:curso/:categoria', (req, res) => {
    const { curso, categoria } = req.params;
    if (categoria) {
        res.send(`Bienvenido al curso: ${curso} de la categoría: ${categoria}`);
    } else {
        res.send(`Bienvenido al curso: ${curso}`);
    }
});

// ============================================
// RUTAS CON VALIDACIONES (Expresiones Regulares)
// ============================================

// Middleware de validación personalizado
const validations = {
    // Solo letras
    alpha: (paramName) => {
        return (req, res, next) => {
            const value = req.params[paramName];
            if (!/^[a-zA-Z]+$/.test(value)) {
                return res.status(404).send('404 NOT FOUND - El parámetro debe contener solo letras');
            }
            next();
        };
    },
    
    // Letras y números
    alphaNumeric: (paramName) => {
        return (req, res, next) => {
            const value = req.params[paramName];
            if (!/^[a-zA-Z0-9]+$/.test(value)) {
                return res.status(404).send('404 NOT FOUND - El parámetro debe contener solo letras y números');
            }
            next();
        };
    },
    
    // Solo números
    numeric: (paramName) => {
        return (req, res, next) => {
            const value = req.params[paramName];
            if (!/^[0-9]+$/.test(value)) {
                return res.status(404).send('404 NOT FOUND - El parámetro debe contener solo números');
            }
            next();
        };
    },
    
    // Valores específicos permitidos
    whereIn: (paramName, allowedValues) => {
        return (req, res, next) => {
            const value = req.params[paramName];
            if (!allowedValues.includes(value)) {
                return res.status(404).send(`404 NOT FOUND - Valores permitidos: ${allowedValues.join(', ')}`);
            }
            next();
        };
    }
};

// Ejemplo: Ruta con validación solo letras
app.get('/cursos-alpha/:curso', 
    validations.alpha('curso'),
    (req, res) => {
        res.send(`Bienvenido al curso: ${req.params.curso}`);
    }
);

// Ejemplo: Ruta con validación whereIn
app.get('/cursos-validos/:curso', 
    validations.whereIn('curso', ['php', 'laravel', 'vue', 'nodejs', 'express']),
    (req, res) => {
        res.send(`Bienvenido al curso: ${req.params.curso}`);
    }
);

// Ejemplo: Ruta con ID numérico
app.get('/cursos-id/:id', 
    validations.numeric('id'),
    (req, res) => {
        res.send(`Bienvenido al curso con ID: ${req.params.id}`);
    }
);

// ============================================
// RUTAS CRUD COMPLETAS PARA POSTS
// ============================================

// Listar todos los posts (INDEX)
app.get('/posts', (req, res) => {
    res.json({
        message: 'Lista de todos los posts',
        posts: [
            { id: 1, title: 'Post 1' },
            { id: 2, title: 'Post 2' }
        ]
    });
});

// Mostrar formulario para crear un post (CREATE - Vista)
app.get('/posts/create', (req, res) => {
    res.send('Hola desde la página para crear posts');
});

// Guardar un nuevo post (STORE)
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    res.json({
        message: 'Aquí se procesará el formulario para crear un post',
        data: { title, content }
    });
});

// Mostrar un post específico (SHOW)
app.get('/posts/:post', (req, res) => {
    const { post } = req.params;
    res.send(`Aquí se mostrará el post: ${post}`);
});

// Mostrar formulario para editar un post (EDIT - Vista)
app.get('/posts/:post/edit', (req, res) => {
    const { post } = req.params;
    res.send(`Aquí se mostrará el formulario para editar un post: ${post}`);
});

// Actualizar un post (UPDATE)
app.put('/posts/:post', (req, res) => {
    const { post } = req.params;
    const { title, content } = req.body;
    res.json({
        message: `Aquí se procesará el formulario para editar el post: ${post}`,
        data: { title, content }
    });
});

// Eliminar un post (DELETE)
app.delete('/posts/:post', (req, res) => {
    const { post } = req.params;
    res.json({
        message: `Aquí se eliminará el post: ${post}`
    });
});

// ============================================
// MANEJO DE ERRORES 404
// ============================================
app.use((req, res) => {
    res.status(404).send('404 NOT FOUND - La ruta no existe');
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Presiona Ctrl+C para detener el servidor`);
});

// Exportar app para testing
module.exports = app;