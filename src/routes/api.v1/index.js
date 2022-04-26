const { user } = require('../../controllers/user.controller')
const { useAuth } = require('../../middlewares/auth.middleware')
const router = require('express').Router()

router.use('/auth', require('./auth'))

router.post('/user', useAuth, user)

module.exports = router