const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const to = require('../../utils/to')

const signUp = async (req, res, next) => {
    const { name, email, password} = req.body
    let [user, noUser] = await to(User.findOne({ email }));
    if (user) {
        return res.status(409).json({msg: 'Mail already exist'})
    }
    
    user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        email: email
    })

    user.password = await bcrypt.hash(password, 10);

    const [save, saveErr] = await to(user.save())

    if (saveErr) {
        return res.status(400).json({msg: 'Internal error on save'})
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
        return res.status(400).json({msg: 'Delete user failed'})
    }
        res.status(200).json({
            msg: "User deleted"
        });
}

module.exports = {
    signUp,
    deleteUser
};