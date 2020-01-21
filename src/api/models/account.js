const mongoose = require ('mongoose')

const accountSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    name: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
});

module.exports = mongoose.model('Account', accountSchema)