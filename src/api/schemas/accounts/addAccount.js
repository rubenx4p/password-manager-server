const Joi = require('@hapi/joi')
const logger = require('../../../config/logger')

const schema = Joi.object({
    key: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
})

module.exports = async (req, res, next) => {
    const { body } = req

    try {
        await schema.validateAsync(body)
        next()
    } catch (err) {
        logger.info(`addAccountSchema :: ${err.message}`)
        
        return res.status(400).json({
            msg: err.message
        })
    }
}