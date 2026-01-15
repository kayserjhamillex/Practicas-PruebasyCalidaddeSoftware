// function requireAuth(req, res, next) {
//   const userId = req.header('x-user-id'); // simple para laboratorio
//   if (!userId) {
//     return res.redirect(302, '/login');
//   }
//   req.user = { id: Number(userId) || userId };
//   return next();
// }
// module.exports = { requireAuth };
const db = require("../stores/db")
function authWeb(req, res, next) {
  const userId = req.header("x-user-id")
  if (!userId) {
    return res.status(302).set("Location", "/login").send("Redirecting to /login")
  }
  const user = db.users.find((u) => String(u.id) === String(userId))
  if (!user) {
    return res.status(302).set("Location", "/login").send("Redirecting to /login")
  }
  req.user = user
  next()
}
module.exports = authWeb