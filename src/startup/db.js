const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW +'@accounts-manager-s9yd9.mongodb.net/test?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
}