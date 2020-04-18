const BasicError = require('./basicError')

class ValidationError extends BasicError {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
      }

}