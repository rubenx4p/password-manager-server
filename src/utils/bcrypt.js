const bcrypt = require('bcryptjs')

const compare = async (key, password) => {
    try {
        const validKey = bcrypt.compare(key, password)

        return validKey
    } catch (err) {
        throw err
    }
}

const hash = async (password) => {
    try {
        const ROUNDS = 10
        const hashedPassword = await bcrypt.hash(password, ROUNDS)

        return hashedPassword
    } catch (err) {
        throw err
    }
}

module.exports = {
    compare,
    hash
}