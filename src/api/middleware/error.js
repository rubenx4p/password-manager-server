const logger = require('../../config/logger');

module.exports = (err, req, res, next) => {
    logger.info(`msg: error handler :: err: ${JSON.stringify(err)}`)

    const { msg = "Something failed", status, err: error, func } = err
    
    res.status(status || 500);
    res.json({ msg })
}