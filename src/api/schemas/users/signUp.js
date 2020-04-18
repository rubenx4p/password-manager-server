const Joi = require('@hapi/joi')
const logger = require('../../../config/logger')

const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})")

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.string().min(8)
})

module.exports = async (req, res, next) => {
    const { body } = req

    try {
        await schema.validateAsync(body)
        next()
    } catch (err) {
        logger.info(`signUpSchema :: ${err.message}`)
        
        return res.status(400).json({
            msg: err.message
        })
    }
}