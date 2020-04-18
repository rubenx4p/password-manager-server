const mongoose = require('mongoose')
const crypto = require("crypto")
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const emailService = require('../../utils/email')
const logger = require('../../config/logger')
const usersDB = require('../db/users')
const messages = require('../constants/messages')
const bcryptUtil = require('../../utils/bcrypt')
const appRoot = require('app-root-path')

const signUp = async (req, res) => {
    const { name, email, password } = req.body

    let user = await usersDB.findOne({ email: email.toLowerCase() })

    if (user) {
        logger.info(`${messages.MAIL_ALREADY_EXIST} :: ${user.email}`)
        return res.status(409).json({msg: messages.MAIL_ALREADY_EXIST})
    }
    
    user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        email: email
    })

    user.password = await bcryptUtil.hash(password)
    
    await usersDB.save(user)

    await emailService.sendVarificationMail(user._id, user.email, req.headers.host)
    
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

    const user = await usersDB.findById(userId)

    if (!user) {
        return res.status(400).json({msg: messages.USER_NOT_FOUND })
    }

    user.confirmed = true

    await usersDB.save(user)
    // if (saveErr) {
    //     return res.status(400).json({msg: 'The time to confirm the email was expired'})
    // }

    res.sendFile(`${appRoot}/src/pages/confirmed.html`)
}

const deleteUser = async (req, res) => {
    usersDB.de
    await usersDB.deleteOne({ _id: req.userData.userId })

    res.status(200).json({
        msg: messages.USER_DELETED_SUCCESSFULY
    })
}

const forgetPassword = async (req, res) => {
    const { email } = req.body
    
    let user = await usersDB.findOne({ email: email.toLowerCase() })

    if (!user) {
        return res.status(400).json({msg: messages.USER_NOT_FOUND })
    }

    const token = crypto.randomBytes(20).toString('hex')

    user.resetPasswordToken = token
    const ONE_DAY = 1000 * 60 * 60 * 24
    user.resetPasswordExpired = Date.now() + ONE_DAY // 1 day

    await usersDB.save(user)

    const emailInfo = {
        to: user.email,
        subject: "[Guardian] Please reset your password", // Subject line
        text: `We heard that you lost your password. Sorry about that!
        But don't worry! You can use the following link to reset your password.
        Please click on that link, or paste it into your browser to reset your password.
        ${req.headers.origin}/reset-password/${token}
        
        If you don't use this link within 1 day, it will expire.
        If you didn't request this, please ignore this email and your password will remain unchanged.`
    }

    await emailService.send(emailInfo)

    res.status(200).json({msg: `Mail sent to ${user.email}`})
}

const resetPassword = async ({ body }, res) => {
    const { token, password } = body
    
    let user = await usersDB.findOne({ resetPasswordToken: token, resetPasswordExpired: { $gt: Date.now() } })
    
    if (!user) {
        return res.status(401).json({msg: messages.NOT_ALLOWED})
    }
    user.password = await bcryptUtil.hash(password)
    user.accounts = []

    await usersDB.save(user)

    res.status(200).json({msg: messages.PASSWORD_RESET_SUCCESSFULLY})
}
module.exports = {
    signUp,
    deleteUser,
    forgetPassword,
    resetPassword,
    confirm
}