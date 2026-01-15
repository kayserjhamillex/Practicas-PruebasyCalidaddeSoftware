let users = []
let id = 1

module.exports = {
  create(user) {
    const newUser = { id: id++, ...user }
    users.push(newUser)
    return newUser
  },
  reset() {
    users = []
    id = 1
  }
}