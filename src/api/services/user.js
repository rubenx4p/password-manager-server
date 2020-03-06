const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const to = require('../../utils/to')

const signUp = async (req, res, next) => {
    const { name, email, password} = req.body
    let [user, noUser] = await to(User.findOne({ email }));
    if (user) {
        return res.status(409).send('Mail already exist')
    }
    
    user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        email: email
    })

    user.password = await bcrypt.hash(password, 10);

    const [save, saveErr] = await to(user.save())

    if (saveErr) {
        return next({msg: 'Internal error on save', status: 400, err: saveErr, func: 'signUp'})
    }

    return res.status(201).json({
        user: {
            id: user._id,
            email: user.email
        }
    })
}

const deleteUser = async (req, res, next) => {
    [_, deleteFailed] = await to(User.deleteOne({ _id: req.userData.userId }))

    if (deleteFailed) {
        return next({msg: 'deleteUser', status: 500, err: deleteFailed, func: 'deleteUser'}) 
    }
        res.status(200).json({
            msg: "User deleted"
        });
}

module.exports = {
    signUp,
    deleteUser
};