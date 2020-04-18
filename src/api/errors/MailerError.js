const BasicError = require('./BasicError')

class MailerError extends BasicError {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
    }

}

module.exports = MailerError