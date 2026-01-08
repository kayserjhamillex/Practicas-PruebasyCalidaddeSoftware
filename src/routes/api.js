const express = require('express');
const { validations } = require('../middleware/validations');
// const { auth } = require('../middleware/auth'); // opcional, ver comentario abajo

const router = express.Router();

// ✅ Ruta API del laboratorio (base para TDD)
// Si le pones auth y tu test no manda token, fallará (equivalente al problema del PDF L02).
router.get('/hello-world', (req, res) => {
  return res.json({ msg: 'Hello, World!' });
});

// --------------------------------------------------
// CRUD API de ejemplo (en memoria) para practicar REST
// GET    /api/posts
// POST   /api/posts
// GET    /api/posts/:id
// PUT    /api/posts/:id
// DELETE /api/posts/:id
// --------------------------------------------------

let posts = [
  { id: 1, title: 'Post 1', content: 'Contenido 1' },
  { id: 2, title: 'Post 2', content: 'Contenido 2' }
];

router.get('/posts', (req, res) => {
  res.json({ data: posts });
});

router.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const nextId = posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  const newPost = { id: nextId, title: title ?? '', content: content ?? '' };
  posts.push(newPost);
  res.status(201).json({ data: newPost });
});

router.get('/posts/:id', validations.numeric('id'), (req, res) => {
  const id = Number(req.params.id);
  const found = posts.find(p => p.id === id);
  if (!found) return res.status(404).json({ error: 'Not Found' });
  res.json({ data: found });
});

router.put('/posts/:id', validations.numeric('id'), (req, res) => {
  const id = Number(req.params.id);
  const idx = posts.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not Found' });

  const { title, content } = req.body;
  posts[idx] = { ...posts[idx], title: title ?? posts[idx].title, content: content ?? posts[idx].content };
  res.json({ data: posts[idx] });
});

router.delete('/posts/:id', validations.numeric('id'), (req, res) => {
  const id = Number(req.params.id);
  const before = posts.length;
  posts = posts.filter(p => p.id !== id);
  if (posts.length === before) return res.status(404).json({ error: 'Not Found' });
  res.status(204).send();
});

module.exports = router;