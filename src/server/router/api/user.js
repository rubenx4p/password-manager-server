const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const checkAuth = require('./middleware/check-auth');

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

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(users => {
            if (users.length < 1) {
                return res.status(401).json({
                    message: 'Auth fail'
                })
            } 
            bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth fail'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: users[0].email,
                        userId: users[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        }
                    )
                    return res.status(200).json({
                        message: 'Auth successful',
                        token
                    })
                }
                return res.status(401).json({
                    message: 'Auth fail'
                })
            })
        })
        .catch(err => {
            console.log(err);
            result.status(500).json({
                error: err
            })
    })
});
router.delete('/:userId', checkAuth, (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            result.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            result.status(500).json({
                error: err
            })
    })
});

module.exports = router;