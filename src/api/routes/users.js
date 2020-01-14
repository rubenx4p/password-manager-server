const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/', async (req, res, nex) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(409).send('Mail already exist')
        }
        user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email
        })
        user.password = await bcrypt.hash(req.body.password, 10);
        await user.save()
        return res.status(201).json({
            user: {
                id: user._id,
                email: user.email
            }
        })
    }
    catch (err) {
        res.status(500).send({
            error: err
        })
    }
});

router.delete('/:userId', auth, async (req, res, next) => {
    try {
        await User.remove({ _id: req.params.userId })
            res.status(200).json({
                message: "User deleted"
            });
    }
    catch(err) {
        console.log(err);
        result.status(500).json({
            error: err
        })
    }
});

module.exports = router;