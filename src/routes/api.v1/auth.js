const { login, register } = require('../../controllers/auth.controller')
const { useJson } = require('../../middlewares/useJson.middleware')
const router = require('express').Router()

router.all("*", useJson)
router.post('/login', login)
router.post('/register', register)

module.exports = router