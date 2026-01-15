let posts = []

module.exports = {
  create(post) {
    posts.push(post)
    return post
  },
  all() {
    return posts
  },
  reset() {
    posts = []
  }
}