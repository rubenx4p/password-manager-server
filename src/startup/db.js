const mongoose = require('mongoose')

module.exports = function () {
    mongoose.connect('mongodb+srv://' + process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + process.env.MONGO_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true
    })
}