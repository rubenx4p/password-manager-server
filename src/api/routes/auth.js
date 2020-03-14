const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const logger = require('../../config/logger')

router.post('/', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).send({ msg: "Invalid email or password"})
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            return res.status(400).send({ msg: "Invalid email or password"})
        }
        const token = user.generateAuthToken();
        
        logger.info('auth succeeded')

        return res.status(200).json({
            msg: 'Auth successful',
            token
        })
    }
    catch(err) {
            console.log(err);
            result.status(500).json({
                msg: err
            })
    }
});

module.exports = router;