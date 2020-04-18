const nodemailer = require("nodemailer")
const jwt = require('jsonwebtoken')
const MailerError = require('../api/errors/MailerError')

const send = async ({ to, subject, text }) => {
    try {
        let smptTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASS  // generated ethereal password
            }
        })
    
        let mailOptions = {
            from: "process.env.EMAIL_USER", // sender address
            to, // list of receivers
            subject, // Subject line
            text
        }
    
        return await smptTransport.sendMail(mailOptions)
    } catch (err) {
        throw new MailerError(err.message)
    }
}

const sendVarificationMail = async (userId, to, host) => {
    try {
        const token = jwt.sign(
            { userId },
            process.env.JWT_KEY,
            { expiresIn: '1d' }
        )
        
        const emailInfo = {
            to,
            subject: "Guardian confirm email", // Subject line
            text: `Please click on the following link, or paste this into your browser to verify your email address.
            ${process.env.PROTOCOL}://${host}/api/users/confirm/${token}`
        }
    
        await send(emailInfo)
    } catch (err) {
        throw new MailerError(err.message)
    }

}

module.exports = {
    send,
    sendVarificationMail
}