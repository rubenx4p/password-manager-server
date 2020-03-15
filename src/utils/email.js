const nodemailer = require("nodemailer");

const send = async ({ to, subject, text }) => {
// create reusable transporter object using the default SMTP transport
    let smptTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASS  // generated ethereal password
        }
    });

    let mailOptions = {
        from: "process.env.EMAIL_USER", // sender address
        to, // list of receivers
        subject, // Subject line
        text
    }

    return await smptTransport.sendMail(mailOptions)
}

module.exports = {
    send
}