const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        useCreateIndex: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/   
    },
    password: {type: String, required: true}
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { email: this.email, userId: this._id },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
    )
    return token;
}

module.exports = mongoose.model('User', userSchema)