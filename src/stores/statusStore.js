// src/stores/statusStore.js
const db = require("./db")

function resetStatuses() {
  db.statuses = []
  db._ids = db._ids || {}
  db._ids.statuses = 1
}

function createStatus({ user_id, body }) {
  if (!db.statuses) db.statuses = []
  if (!db._ids) db._ids = {}
  if (!db._ids.statuses) db._ids.statuses = 1

  const status = {
    id: db._ids.statuses++,
    user_id,
    body,
    created_at: new Date().toISOString(),
  }

  db.statuses.push(status)
  return status
}

function findByBodyAndUserId(body, user_id) {
  return (db.statuses || []).find((s) => s.body === body && s.user_id === user_id)
}

module.exports = {
  resetStatuses,
  createStatus,
  findByBodyAndUserId,
}