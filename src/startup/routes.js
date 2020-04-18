const morgan = require('morgan')
const bodyParser = require('body-parser')
const accounts = require('../api/routes/accounts')
const users = require('../api/routes/users')
const auth = require('../api/routes/auth')
const logger = require('../config/logger')
const error = require('../api/middleware/error')

module.exports = function (app) {
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: logger.stream }))
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 
        'Origin, X-Request-With, Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})
    
    app.use('/api/accounts', accounts)
    app.use('/api/users', users)
    app.use('/api/auth', auth)    
    app.use(error)
}

process.on('unhandledRejection', (ex) => {
    logger.error(ex.message, ex)
})