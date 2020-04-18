const logger = require('../../config/logger')
const usersDB = require('../db/users')
const messages = require('../constants/messages')
const bcrypt = require('../../utils/bcrypt')
const emailService = require('../../utils/email')

const login = async (req, res) => {
    const { email, password } = req.body

    // let user = await usersDB.findOne({ email: email.toLowerCase() }, {confirmed: 1, password: 1})
    let user = await usersDB.findOne({ email: email.toLowerCase() }, { confirmed: 1, email: 1, password: 1 })

    if (!user) {
        logger.info(messages.INVALID_CREDENTIALS)
        return res.status(400).json({msg: messages.INVALID_CREDENTIALS })
    }
    
    if (!user.confirmed) {
        await emailService.sendVarificationMail(user._id, user.email, req.headers.host)
        
        return res.status(403).send({ msg: messages.CONFIRM_YOUR_MAIL })
    }
    
    const validKey = await bcrypt.compare(password, user.password)
    
    if (!validKey) {
        logger.info(messages.INVALID_CREDENTIALS)
        return res.status(400).json({msg: messages.INVALID_CREDENTIALS })
    }

    const token = user.generateAuthToken()
    
    logger.info(messages.SUCCESSFUL_AUTHENTICATION)

    return res.status(200).json({
        msg: messages.SUCCESSFUL_AUTHENTICATION,
        token
    })
}

module.exports = {
    login
}