const appRoot = require('app-root-path')
const { createLogger, transports } = require('winston')

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    colorize: true,
  },
}

// Enable exception handling when you create your logger.
const logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
  exceptionHandlers: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
})

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message)
  },
}

module.exports = logger