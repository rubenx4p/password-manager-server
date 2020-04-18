const logger = require('../../config/logger')

module.exports = (err, req, res, next) => {
    logger.error(`${err.name} :: ${err.message} :: ${err.stack}`)

    res.status(500).json({ msg: 'Something failed'})
}