const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.post('/', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).send("Invalid email or password")
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            return res.status(400).send("Invalid email or password")
        }
        const token = user.generateAuthToken();
        return res.status(200).json({
            message: 'Auth successful',
            token
        })
    }
    catch(err) {
            console.log(err);
            result.status(500).json({
                error: err
            })
    }
});

module.exports = router;