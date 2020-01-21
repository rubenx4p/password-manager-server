const router = require('express').Router();
const auth = require('../middleware/auth');
const userService = require('../services/user')

router.post('/', userService.signUp);
router.delete('/', auth, userService.deleteUser);

module.exports = router;