const Joi = require('@hapi/joi')
const logger = require('../../../config/logger')

const schema = Joi.object({
    email: Joi.string().email()
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