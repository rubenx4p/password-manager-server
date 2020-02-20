const morgan = require('morgan');
const bodyParser = require('body-parser');
const accounts = require('../api/routes/accounts');
const users = require('../api/routes/users');
const auth = require('../api/routes/auth');

module.exports = function (app) {
    app.use(morgan('dev'))
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
        'Origin, X-Request-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
})
    
    app.use('/api/accounts', accounts);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    app.use((req, res, next) => {
        const err = new Error('Route not found');
        err.status = 404;
        next(err);
    })
    
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({error: {
            msg: err.message
        }})
    })
}