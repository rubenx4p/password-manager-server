const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const to = require('../../utils/to')
const emailService = require('../../utils/email')
const logger = require('../../config/logger')

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

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_KEY,
        { expiresIn: '1d' }
    )
   
    const emailInfo = {
        to: user.email,
        subject: "Account-Manager confirm email", // Subject line
        text: `Please click on the following link, or paste this into your browser to confirm your email.
        ${process.env.PROTOCOL}://${req.headers.host}/api/users/confirm/${token}`
    }

    const [sent, sentErr] = await to(emailService.send(emailInfo))

    if (sentErr) {
        return res.status(400).json({msg: 'Problem sending mail'})
    }

    return res.status(201).json({
        user: {
            id: user._id,
            email: user.email
        },
        msg: `You have successfully registered. Confirmation mail was sent to ${user.email}`
    })
}

const confirm = async (req, res) => {
    const { token } = req.params

    const decoded = jwt.verify(token, process.env.JWT_KEY)

    const { userId } = decoded
    
    let [user] = await to(User.findOne({ _id: userId }));

    user.confirmed = true

    const [save, saveErr] = await to(user.save())

    if (saveErr) {
        return res.status(400).json({msg: 'The time to confirm the email was expired'})
    }

    res.status(200).json({msg: `confirmed successfuly`})
}

const deleteUser = async (req, res) => {
    [_, deleteFailed] = await to(User.deleteOne({ _id: req.userData.userId }))

    if (deleteFailed) {
        return res.status(400).json({msg: 'Delete user failed'})
    }
        res.status(200).json({
            msg: "User deleted"
        });
}

const forgetPassword = async (req, res, next) => {
    const { email } = req.body
    
    let [user] = await to(User.findOne({ email }));

    if (user) {
        const token = crypto.randomBytes(20).toString('hex')

        user.resetPasswordToken = token;
        user.resetPasswordExpired = Date.now() + 3600000 // 1 hour

        const [save, saveErr] = await to(user.save())

        if (saveErr) {
            return res.status(400).json({msg: 'Internal error on save'})
        }

        const emailInfo = {
            to: user.email,
            subject: "[Account-Manager] Please reset your password", // Subject line
            text: `We heard that you lost your Account-Manager password. Sorry about that!
            Bug don't worry! You can use the following link to reset your password.
            Please click on that link, or paste it into your browser to reset your password.
            ${process.env.PROTOCOL}://${req.headers.origin}/reset-password/${token}
            
            If you don't use this link within 1 day, it will expire.
            If you didn't request this, please ignore this email and your password will remain unchanged.`
        }

        const [sent, sentErr] = await to(emailService.send(emailInfo))

        if (sentErr) {
            logger.error(`Problem sending mail :: ${sentErr.message}`)
        }
    }

    res.status(200).json({msg: `Mail sent to ${user.email}`})
}

const resetPassword = async ({ body }, res) => {
    const { token } = body
    
    let [user] = await to(User.findOne({ resetPasswordToken: token, resetPasswordExpired: { $gt: Date.now() } }));
    
    if (!user) {
        return res.status(401).json({msg: 'No Allowed'})
    }

    user.password = await bcrypt.hash(body.password, 10);
    user.accounts = [];

    const [save, saveErr] = await to(user.save())

    if (saveErr) {
        return res.status(400).json({msg: 'Problem saving'})
    }

    res.status(200).json({msg: `Password reset successfully`})

}
module.exports = {
    signUp,
    deleteUser,
    forgetPassword,
    resetPassword,
    confirm
};