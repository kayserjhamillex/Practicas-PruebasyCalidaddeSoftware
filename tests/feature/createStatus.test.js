// tests/feature/createStatus.test.js
const request = require("supertest");
const app = require("../../src/app");
const statusStore = require("../../src/stores/statusStore");
const userStore = require("../../src/stores/userStore");

describe("Práctica 8 - Create Status (TDD)", () => {
  beforeEach(() => {
    // reset en memoria para que cada test sea independiente
    if (typeof userStore.reset === "function") userStore.reset()
    if (typeof statusStore.resetStatuses === "function") statusStore.resetStatuses()
  })

  test("an authenticated user can create status", async () => {
    // GIVEN
    const user = userStore.createUser
      ? userStore.createUser({ name: "Ana" })
      : { id: 1, name: "Ana" } // fallback si tu store maneja diferente

    // WHEN
    const res = await request(app)
      .post("/statuses")
      .set("x-user-id", String(user.id))
      .send({ body: "Mi primer estado publicado" })

    // THEN
    expect(res.statusCode).toBe(201)
    expect(res.body.message).toBe("El estado fue creado correctamente")

    const found = statusStore.findByBodyAndUserId("Mi primer estado publicado", user.id)
    expect(found).toBeTruthy()
  })

  test("guest users can not create statuses", async () => {
    const res = await request(app).post("/statuses").send({ body: "No debería crear" })

    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toBe("/login")
  })
})