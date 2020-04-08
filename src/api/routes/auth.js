const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const logger = require('../../config/logger')
const to = require('../../utils/to')

router.post('/', async (req, res) => {
    const { email, password } = req.body
    
    const [user] = await to(User.findOne({ email: String(email).toLowerCase() }))
    
    if (!user) {
        return res.status(400).send({ msg: "Invalid email or password"})
    }
    
    if (!user.confirmed) {
        return res.status(400).send({ msg: "Please confirm your email to login"})
    }

    const validPassword = await bcrypt.compare(password, user.password)
    
    if (!validPassword) {
        return res.status(400).send({ msg: "Invalid email or password"})
    }

    const token = user.generateAuthToken();
    
    logger.info('auth succeeded')

    return res.status(200).json({
        msg: 'Auth successful',
        token
    })
});

module.exports = router;