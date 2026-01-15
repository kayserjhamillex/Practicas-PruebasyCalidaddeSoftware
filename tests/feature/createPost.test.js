const request = require('supertest')
const app = require('../../src/app')
const postStore = require('../../src/stores/postStore')
const userStore = require('../../src/stores/userStore')

describe('Crear publicaciones (TDD)', () => {
  beforeEach(() => {
    postStore.reset()
    userStore.reset()
  })
  test('un usuario autenticado puede crear un post', async () => {
    const user = userStore.create({ name: 'Juan' })
    const response = await request(app)
      .post('/p8/posts')
      .set('x-user-id', user.id)
      .send({ body: 'Mi primer estado' })
    expect(response.status).toBe(201)
    expect(postStore.all()).toContainEqual({
      body: 'Mi primer estado',
      userId: user.id
    })
  })
  test('usuarios invitados no pueden crear posts', async () => {
    const response = await request(app)
        .post('/p8/posts')
        .send({ body: 'Intento ilegal' })
    expect(response.status).toBe(401)
    })
})