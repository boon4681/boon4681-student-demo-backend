const { user, profile } = require('../../controllers/user.controller')
const { useAuth } = require('../../middlewares/auth.middleware')
const { useProfile } = require('../../middlewares/profile.middleware')
const router = require('express').Router()
const path = require('path')
const ServerRoot = path.resolve(__dirname, '../../..');
const express = require('express')

router.use('/auth', require('./auth'))

router.post('/user', useAuth, user)
router.use('/user/profile', useAuth, useProfile, express.static(path.join(ServerRoot,`./static/user/profile`)))
module.exports = router