const router = require('express').Router()
const auth = require('../middleware/auth')
const signUpSchema = require('../schemas/users/signUp')
const userService = require('../services/user')

router.post('/', signUpSchema, userService.signUp)
router.delete('/', auth, userService.deleteUser)
router.post('/forgot-password', userService.forgetPassword)
router.post('/reset-password', userService.resetPassword)
router.get('/confirm/:token', userService.confirm)

module.exports = router