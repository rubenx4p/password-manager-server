const parse = (result) => ({
    id: result._id,
    name: result.name,
    username: result.username,
    password: result.password
})

module.exports = { parse }