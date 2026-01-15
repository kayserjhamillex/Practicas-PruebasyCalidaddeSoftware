const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const ControladorPost = require('../controllers/PostController')

router.post('/posts', auth, ControladorPost.store);

module.exports = router