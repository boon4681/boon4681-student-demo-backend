const { login } = require('../../controllers/auth.controller')
const { useJson } = require('../../middlewares/useJson.middleware')
const router = require('express').Router()

router.all("*", useJson)
router.post('/login', login)

module.exports = router