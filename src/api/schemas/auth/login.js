const Joi = require('@hapi/joi')
const logger = require('../../../config/logger')

const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().required()
})

module.exports = async (req, res, next) => {
    const { body } = req

    try {
        await schema.validateAsync(body)
        next()
    } catch (err) {
        logger.info(`loginSchema :: ${err.message}`)

        return res.status(400).json({
            msg: err.message
        })
    }
}