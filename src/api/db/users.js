const DBError = require('../errors/DBError')
const User = require('../models/user')

const findById = async (id) => {
    try {
        const user = await User.findById(id)

        return user
    } catch (err) {
        throw new DBError(err.message)
    }
}

const findOne = async (query, selectQuery) => {
    try {
        let user

        if (selectQuery) {
            user = await User.findOne(query).select(selectQuery)
        } else {
            user = await User.findOne(query)
        }
        

        return user
    } catch (err) {
        throw new DBError(err.message)
    }
}

const save = async (user) => {
    try {
        await user.save()
    } catch (err) {
        throw new DBError(err.message)
    }
}

const findAccountById = async (user, id) => {
    try {
        const account = await user.accounts.id(id)

        return account
    } catch (err) {
        throw new DBError(err.message)
    }
}

const pullAccount = async (user, id) => {
    try {
        const account = await user.accounts.pull(id)

        return account
    } catch (err) {
        throw new DBError(err.message)
    }
}
const deleteOne = async (query) => {
    try {
        User.deleteOne(query)
    } catch (err) {
        throw new DBError(err.message)
    }
}

module.exports = {
    findById,
    findOne,
    save,
    findAccountById,
    pullAccount,
    deleteOne
}