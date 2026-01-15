const db = {
  users: [],
  statuses: [],
  _ids: { users: 1, statuses: 1 },

  reset() {
    this.users = []
    this.statuses = []
    this._ids = { users: 1, statuses: 1 }
  },

  createUser(attrs = {}) {
    const user = {
      id: this._ids.users++,
      name: attrs.name ?? "Test User",
      email: attrs.email ?? `user${Date.now()}@test.com`,
    }
    this.users.push(user)
    return user
  },

  createStatus(attrs = {}) {
    const status = {
      id: this._ids.statuses++,
      user_id: attrs.user_id,
      body: attrs.body,
      created_at: new Date().toISOString(),
    }
    this.statuses.push(status)
    return status
  },
}

module.exports = db