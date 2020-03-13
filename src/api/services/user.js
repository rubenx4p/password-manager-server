const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require('../models/user');
const to = require('../../utils/to')
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

const forgetPassword = async (req, res, next) => {
    const { email } = req.body
    
    let [user] = await to(User.findOne({ email }));

    if (!user) {
        return res.status(410).json({msg: 'No account with that email address exist'})
    }

    const token = crypto.randomBytes(20).toString('hex')

    user.resetPasswordToken = token;
    user.resetPasswordExpired = Date.now() + 3600000 // 1 hour

    const [save, saveErr] = await to(user.save())

    if (saveErr) {
        return res.status(400).json({msg: 'Internal error on save'})
    }

  // create reusable transporter object using the default SMTP transport
  let smptTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASS  // generated ethereal password
    }
  });
    
    logger.info(req.headers)

    let mailOptions = {
        from: process.env.EMAIL_USER, // sender address
        to: user.email, // list of receivers
        subject: "Account-ui password reset", // Subject line
        text: `You are receiving this because you have requested the reset of the password.
        Please click on the following link, or paste this into your browser to complete the proccess.
        http://${req.headers.origin}/reset-password/${token}
        
        If you didn't request this, please ignore this email and your password will remain unchanged`
    }

    const [sent, sentErr] = await to(smptTransport.sendMail(mailOptions))

    if (sentErr) {
        return res.status(400).json({msg: 'Problem sending mail'})
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
    resetPassword
};