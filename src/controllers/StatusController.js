// src/controllers/StatusController.js
const statusStore = require("../stores/statusStore")

function store(req, res) {
  const body = req.body?.body

  // req.user viene de authWeb.js (middleware)
  const userId = req.user.id

  const status = statusStore.createStatus({
    user_id: userId,
    body,
  })

  return res.status(201).json({
    message: "El estado fue creado correctamente",
    status,
  })
}

module.exports = { store }