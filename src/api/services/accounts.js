const Account = require('../models/account')
const aes = require('../../utils/aes')
const usersDB = require('../db/users')
const messages = require('../constants/messages')
const bcrypt = require('../../utils/bcrypt')

const getAccounts = async ({ userData }, res) => {
    const { userId } = userData

    const user = await usersDB.findById(userId)
    
    if (!user) {
        return res.status(400).json({msg: messages.USER_NOT_FOUND })
    }

    res.status(200).json({ accounts: user.accounts })
  }

const addAccount = async ({ userData, body }, res) => {
    const { userId } = userData

    const user = await usersDB.findById(userId)

    if (!user) {
        return res.status(400).json({msg: messages.USER_NOT_FOUND })
    }

    const { key, password, name, username } = body

    const validKey = await bcrypt.compare(key, user.password)
    
    if (!validKey) {
        return res.status(400).json({msg: messages.INVALID_KEY})
    }
    
    const ciphertext = aes.encrypt(password, key)
    const account = new Account({
        name,
        username,
        password: ciphertext
    })

    user.accounts.push(account)

    await usersDB.save(user)

    res.status(200).json({
        msg: messages.ACCOUNT_ADDED_SUCCESSFULY,
        account: { id: account._id, name: account.name}
    })
}

const deleteAccount = async ({ userData, params, body }, res) => {
    const { userId } = userData

    const user = await usersDB.findById(userId)

    if (!user) {
        return res.status(400).json({msg: messages.USER_NOT_FOUND })
    }

    const { key } = body

    const validKey = await bcrypt.compare(key, user.password)

    if (!validKey) {
        return res.status(400).json({msg: messages.INVALID_KEY })
    }

    const { id } = params

    await usersDB.pullAccount(user, id)

    await usersDB.save(user)

    res.status(200).send({msg: messages.ACCOUNT_SUCCESSFULY_REMOVED })
}
  
const receiveAccountPassword = async ({ userData, params, body }, res) => {
    const { userId } = userData

    const user = await usersDB.findById(userId)

    if (!user) {
        return res.status(400).json({msg: messages.USER_NOT_FOUND})
    }

    const { key } = body

    const validKey = await bcrypt.compare(key, user.password)

    if (!validKey) {
        return res.status(400).json({msg: messages.INVALID_KEY })
    }

    const { id } = params

    const account = await usersDB.findAccountById(user, id)

    if (!account) {
        return res.status(400).json({msg: messages.ACCOUNT_DOES_NOT_EXIST})
    }
    const password = aes.decrypt(account.password, key)

    if (!password) {
        return res.status(400).json({msg: messages.INVALID_KEY})
    }
    
    res.status(200).json({
        msg: messages.RECEIVED_PASSWARD_SUCCESSFULY,
        password
    })
}

const editAccount = async ({ userData, params, body }, res, next) => {
    const { userId } = userData
    
    const user = await usersDB.findById(userId)
    
    if (!user) {
        return res.status(400).json({msg: messages.USER_NOT_FOUND })
    }

    const { key, name, username, password } = body

    const validKey = await bcrypt.compare(key, user.password)
    
    if (!validKey) {
        return res.status(400).json({msg: messages.INVALID_KEY })
    }

    const ciphertext = aes.encrypt(password, key)

    const account = user.accounts.id(params.id)

    account.set({
        name,
        username,
        password: ciphertext
    })
    
    await usersDB.save(user)

    const result = {
        account: {
            id: account._id,
            name,
            password: ciphertext,
            username
        },
        msg: messages.ACCOUNT_EDITED_SUCCESSFULY
    }
    res.status(200).json(result)
}

module.exports = {
    getAccounts,
    addAccount,
    deleteAccount,
    receiveAccountPassword,
    editAccount
}