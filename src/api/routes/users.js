const router = require('express').Router();
const auth = require('../middleware/auth');
const userService = require('../services/user')

router.post('/', userService.signUp);
router.delete('/', auth, userService.deleteUser);
router.post('/forgot-password', userService.forgetPassword);
router.post('/reset-password', userService.resetPassword);

module.exports = router;