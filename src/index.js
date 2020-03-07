const logger = require('./config/logger')
require('dotenv').config()
const express = require('express');
const app = express();

require('./startup/db')()
require('./startup/routes')(app)
require('./startup/prod')(app)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    logger.info(`Server is up on port ${port}`)
});