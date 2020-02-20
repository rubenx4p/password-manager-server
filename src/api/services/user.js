const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const signUp = async (req, res, nex) => {
    try {
        const { name, email, password} = req.body
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).send('Mail already exist')
        }
        
        user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            email: email
        })
        user.password = await bcrypt.hash(password, 10);
        await user.save()
        return res.status(201).json({
            user: {
                id: user._id,
                email: user.email
            }
        })
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

const deleteUser = async (req, res, next) => {
    try {
        await User.deleteOne({ _id: req.userData.userId })
            res.status(200).json({
                msg: "User deleted"
            });
    }
    catch(err) {
        console.log(err);
        result.status(500).json({
            error: err
        })
    }
}

module.exports = {
    signUp,
    deleteUser
};