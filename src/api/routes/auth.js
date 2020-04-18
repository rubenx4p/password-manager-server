const router = require('express').Router()
const authService = require('../services/auth')
const loginSchema = require('../schemas/auth/login')

router.post('/', loginSchema, authService.login)

module.exports = router