const BasicError = require('./BasicError')

class DBError extends BasicError {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
    }

}

module.exports = DBError